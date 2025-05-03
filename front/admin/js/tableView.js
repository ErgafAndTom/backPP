prices.addEventListener('click', e => {
    filesContainer.classList.add("d-none")
    tabl2.classList.remove("d-none")
    tabl1.classList.remove("d-none")
    statisticsContainer.classList.remove("d-none")
    sendData("/getpricesTabl", "GET").then(e => {
        console.log(e);
        renderTable(e)
        let dataRework1 = dataRework(e)
        console.log(dataRework1);
    })
})

function renderTable(e) {
    pricesContainer.innerHTML = ""
    pricesContainer.classList.remove("d-none")
    pricesTableHeaderContainer.innerHTML = ""
    pricesTableHeaderContainer.classList.remove("d-none")
    let tr1 = document.createElement("tr")
    let th1 = document.createElement("th")
    tr1.appendChild(th1)
    // tr1.classList.add("trColumn")
    th1.innerText = "#"
    th1.classList.add("borderTablElem")
    th1.setAttribute("scope", "col")
    pricesTableHeaderContainer.appendChild(tr1)
    for (let i = 0; i < e[0].length; i++){
        let th2 = document.createElement("th")
        th2.innerText = i.toString()
        th2.classList.add("borderTablElem")
        th2.setAttribute("scope", "col")
        tr1.appendChild(th2)
    }
    for (let i = 0; i < e.length; i++){
        let tr = document.createElement("tr")
        let th = document.createElement("th")
        th.innerText = i.toString()
        th.classList.add("borderTablElem")
        th.setAttribute("scope", "row")
        // tr.classList.add("trColumn")
        tr.appendChild(th)
        for (let o = 0; o < e[i].length; o++){
            let td = document.createElement("td")
            // let input = document.createElement("input")
            // td.appendChild(input)
            td.classList.add("borderTablElem")
            // input.classList.add("borderTablElem")
            td.innerText = e[i][o]
            // input.value = e[i][o]
            tr.appendChild(td)
            td.addEventListener("click", target => {

            })
        }
        pricesContainer.appendChild(tr)
    }
}

function dataRework(json) {
    let x = 1
    let data = [];
    json.forEach(e => {
        if(e[0] === null){
            x=1
        }
        else {
            if(x === 1){
                data.push({
                    name: e[0],
                    children: []
                })
                x = 0
            }
            else {
                data[data.length-1].children.push(e)
            }
        }
    })
    return data
}