const {execSync} = require('child_process');
const {networkInterfaces} = require('os');
const dns = require('dns');
const {ARP, Ether, srp} = require('scapy');
const Graph = require('graphlib').Graph;
const {createServer} = require('http');
const d3 = require('d3');
const {NodeVM} = require('vm2');
const threading = require('worker_threads');
const os = require('os');
const {ThreadPool} = require('node-worker-threads-pool');

function getLocalIp() {
    // Получение локального IP-адреса.
    let localIp = '127.0.0.1';
    const ifaces = networkInterfaces();
    for (const dev in ifaces) {
        for (const details of ifaces[dev]) {
            if (details.family === 'IPv4' && !details.internal) {
                localIp = details.address;
            }
        }
    }
    return localIp;
}

function getSsid() {
    // Получение текущего SSID сети.
    let ssid = 'Неизвестно';
    try {
        const platform = os.type();
        if (platform === 'Windows_NT') {
            const result = execSync('netsh wlan show interfaces', {encoding: 'utf8'});
            const lines = result.split('\n');
            for (const line of lines) {
                if (line.includes('SSID') && !line.includes('BSSID')) {
                    ssid = line.split(':')[1].trim();
                    break;
                }
            }
        } else if (platform === 'Linux') {
            ssid = execSync('iwgetid -r', {encoding: 'utf8'}).trim();
        }
    } catch (e) {
        console.log(`Ошибка при получении SSID: ${e}`);
        ssid = 'Неизвестно';
    }
    return ssid;
}

function isRussian(text) {
    // Проверка, содержит ли текст русские символы.
    return /[а-яА-Я]/.test(text);
}

function scanIp(ip, devices, newDevicesEvent, G, routerIp, ssid, svg, pos) {
    // Сканирование одного IP-адреса и обновление графа.
    try {
        const arp = new ARP({pdst: ip});
        const ether = new Ether({dst: 'ff:ff:ff:ff:ff:ff'});
        const packet = ether.addPayload(arp);

        srp(packet, 1, 0)
            .then((result) => {
                result.forEach(([sent, received]) => {
                    if (!devices.some(device => device.ip === received.psrc)) {
                        dns.reverse(received.psrc, (err, hostnames) => {
                            let hostname;
                            if (err) {
                                hostname = 'socket.herror';
                            } else {
                                hostname = hostnames[0];
                                if (isRussian(hostname)) {
                                    hostname = 'is_russian(hostname)';
                                }
                            }
                            devices.push({ip: received.psrc, mac: received.hwsrc, hostname});
                            console.log(`Обнаружено устройство: ${received.psrc} - ${hostname}`);
                            newDevicesEvent.set();

                            // Обновляем граф
                            G.setNode(received.psrc, {label: `${hostname}\n${received.psrc}`, color: 'blue'});
                            G.setEdge(routerIp, received.psrc, {color: 'black'});

                            drawGraph(G, svg, pos);
                        });
                    }
                });
            })
            .catch(e => {
                console.log(`Ошибка при сканировании IP ${ip}: ${e}`);
            });
    } catch (e) {
        console.log(`Ошибка при сканировании IP ${ip}: ${e}`);
    }
}

function buildGraph(G, devices, routerIp, ssid) {
    // Первичная настройка графа сети.
    G.clear();

    G.setNode(ssid, {label: `SSID: ${ssid}`, color: 'yellow'});
    G.setNode(routerIp, {label: `Маршрутизатор\n${routerIp}`, color: 'red'});
    G.setEdge(ssid, routerIp);

    const localIp = getLocalIp();
    if (!G.hasNode(localIp)) {
        try {
            dns.reverse(localIp, (err, hostnames) => {
                let localHostname;
                if (err) {
                    localHostname = 'socket.herror';
                } else {
                    localHostname = hostnames[0];
                    if (isRussian(localHostname)) {
                        localHostname = 'is_russian(localHostname)';
                    }
                }
                const label = `${localHostname}\n${localIp}`;
                G.setNode(localIp, {label, color: 'green'});
                G.setEdge(routerIp, localIp, {color: 'green', width: 2});
            });
        } catch (e) {
            console.log(`Ошибка при настройке локального узла: ${e}`);
        }
    }
}

function drawGraph(G, svg, pos) {
    // Отображение графа сети.
    svg.selectAll('*').remove();

    const nodes = G.nodes().map(id => ({id, ...G.node(id)}));
    const edges = G.edges().map(({v, w}) => ({source: v, target: w, ...G.edge(v, w)}));

    const link = svg.append('g')
        .selectAll('line')
        .data(edges)
        .enter().append('line')
        .style('stroke', d => d.color)
        .style('stroke-width', d => d.width || 1);

    const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', 10)
        .style('fill', d => d.color);

    const text = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('x', 12)
        .attr('dy', '.35em')
        .text(d => d.label);

    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(edges).distance(30))
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(300, 150))
        .on('tick', () => {
            link.attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('cx', d => d.x)
                .attr('cy', d => d.y);

            text.attr('transform', d => `translate(${d.x},${d.y})`);
        });
}

function main() {
    const localIp = getLocalIp();
    const ipParts = localIp.split('.');
    const baseIp = ipParts.slice(0, 3).join('.');
    const ipRange = `${baseIp}.1/24`;

    console.log(`Сканирование сети ${ipRange}...`);

    const routerIp = `${baseIp}.1`;
    const ssid = getSsid();
    console.log(`SSID сети: ${ssid}`);

    const devices = [];
    const newDevicesEvent = new threading.EventEmitter();

    const G = new Graph();
    const pos = null;

    const svg = d3.select('svg')
        .attr('width', 600)
        .attr('height', 300);

    buildGraph(G, devices, routerIp, ssid);

    const pool = new ThreadPool({size: 10});

    const ipList = Array.from({length: 254}, (_, i) => `${baseIp}.${i + 1}`);
    ipList.forEach(ip => {
        pool.run(() => scanIp(ip, devices, newDevicesEvent, G, routerIp, ssid, svg, pos));
    });

    try {
        while (!newDevicesEvent.listenerCount('') > 0) {
            newDevicesEvent.once('', () => {
                setTimeout(() => {
                }, 10);
            });
        }
    } catch (e) {
        console.log("Прерывание сканирования пользователем.");
    } finally {
        console.log(`Сканирование завершено. Найдено устройств: ${devices.length}`);
    }
}

main();