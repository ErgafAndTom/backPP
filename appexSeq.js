const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const utf8 = require('utf8');
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const fs = require('fs');
// const jwt = require('jsonwebtoken');
const busboy = require('connect-busboy');
const logIn = require('./back/login/logIn');
const getSessionAndPagesCount = require('./back/getSessionAndPagesCount');
const calculating = require('./back/newcalc/calculating');
const calculatingNewArtem = require('./back/calculatingNewArtem');
const createOrderInCash = require('./back/order/new/createOrderInCash');
const getAllOrders = require('./back/order/new/getAllOrders');
const saveOrder = require('./back/order/new/saveOrder');
const saveOrder1 = require('./back/order/new/saveOrder1');
const addThingToOrder = require('./back/order/new/addThingToOrder');
const NewaddThingToOrder = require('./back/order/new/NewaddThingToOrder');
//price---------------------------------------------------------
// const priceCounter = require('./back/price/ifsForThisTabl');
const processingPrice = require('./back/price/processingPrices');
//log---------------------------------------------------------
const log = require('./back/log/log');
//files---------------------------------------------------------
const getContentType = require('./back/files/getContentType');
const allAfterUpload = require('./allAfterUpload');
const files = require('./files');
const deleteFile = require('./deleteFile');
//orders---------------------------------------------------------
// const createOrder = require('./back/order/createOrder');
// const getOrders = require('./back/order/getOrders');
//exel---------------------------------------------------------
const readXlsxFile = require('read-excel-file/node');
//mysql---------------------------------------------------------
const mysql = require("mysql2");
const {getNameService} = require("./back/serviceNames");
// const {update} = require("./back/files/updateFile");
const createOrderAwait = require("./back/order/createOrderAwait");
const {getUsers} = require("./back/users/users");
const {getOrdersAwait} = require("./back/order/getOrdersAwait");
// const {createDatabases} = require("./back/start/coldStart");
const {adminCreateOrder} = require("./back/order/adminCreateOrder");
const {updateOrder} = require("./back/order/updateOrder");
const {updateFileAwait} = require("./back/files/updateFileAwait");
const filtrForAcessGroup = require("./back/sequrity/filtrForAcessGroup");
//react-----------------------------------------------------------------------------------------

//react close-----------------------------------------------------------------------------------------
const databases = {
    main: "printpeaksdb",
    statist: "calcStatist",
    materials: "calcMaterials",
};
// const configSQLConnection = {
//     host: "localhost",
//     user: "calcCRUDL",
//     database: databases.main,
//     password: "12345"
// }
// let connectNotBdConfig = {
//     host: "localhost",
//     user: "calcCRUD",
//     password: "1234"
// }
let tableMain;
let tableErgaf;
let tableNew;
let prices;
let prices2;
let pricesNew;
// const ArtemBD = require('./back/ArtemBD.js');
// ArtemBD.Action.create({
//         userId: Math.floor(Math.random() * 1000), // Random user ID
//     }).then((action) => {
//     console.log("Action created:", action);
// }).catch((error) => {
//     console.error("Error creating action:", error);
// });
// ArtemBD.sequelize.sync()

function readPrices() {
    readXlsxFile(fs.createReadStream(__dirname + "/data/newtableMain1.xlsx")).then((rows) => {
        tableMain = rows
        console.log("tableMain reading close with no err");
        prices = processingPrice.processingPricesInTableToPrices(tableMain)
        console.log("цены преобразованы");
    })
}

function readPrices2() {
    readXlsxFile(fs.createReadStream(__dirname + "/data/PricesForBeIdealModel.xlsx")).then((rows) => {
        tableErgaf = rows
        console.log("tableMain reading close with no err");
        prices2 = processingPrice.processingPricesInTableToPrices(tableErgaf)
        console.log("цены преобразованы");
    })
}

function readPricesNew() {
    readXlsxFile(fs.createReadStream(__dirname + "/data/PricesNEW.xlsx")).then((rows) => {
        tableNew = rows
        console.log("tableMain reading close with no err");
        pricesNew = processingPrice.processingPricesInTableToPrices(tableNew)
        console.log("цены преобразованы");
    })
}

//for pdfJs---------------------------------------------------------
// const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
// const util = require("util");
// const stream = require("stream");
// const CMAP_URL = "../../node_modules/pdfjs-dist/cmaps/";
// const CMAP_PACKED = true;
//------------------------------------------------------------------


// const {Sequelize, Model, DataTypes} = require('sequelize');
const {updateFileAwait2} = require("./back/files/updateFileAwait2");
const {adminGetTable} = require("./back/admin/gettable/adminGetTable");
const {adminAddToTable} = require("./back/admin/addtotable/adminAddToTable");
const {adminDeleteInTable} = require("./back/admin/deleteintable/adminDeleteInTable");
const {
    sequelize, Types, Users, Files, Sessions, Orders, Actions, Services, Devices, Materials, Products, ProductUnits,
    ProductUnit, Product, Counters, OrderUnit, Order, Op
} = require("./back/modelDB");
const {adminGetProducts, adminProducts} = require("./back/admin/products/products");
const {adminRedTable} = require("./back/admin/redtable/adminRedTable");
const {InterfaceEAV} = require("./back/InterfaceEAV");
const {createElementalStructure} = require("./coldStart");
// const {sequelize2} = require("./back/ModelEAVDB");
// const {sequelize3} = require("./back/ArtemBD");
// const {Users} = require("./back/modelDB");
// const oneHour = 1000 * 60 * 60;
const port = 5555;

app.use(busboy());
app.use(cookieParser('govnobliat'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
// app.use("/", express.static(__dirname + "/front/main"));
// app.use("/test", express.static(__dirname + "/front/main2"));
// app.use("/createOrder", express.static(__dirname + "/front/createorder"));
// app.use("/login", express.static(__dirname + "/front/login"));
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
app.get('/createOrder', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
app.get('/currentUser', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
app.get('/admin', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
app.get('/files', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
app.get('/Products*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
app.get('/Orders*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
app.get('/CashFull*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.use((req, res, next) => {
    let url = req.url.split('/')[1]
    if (req.url === "/orders") {
        if (req.method === "GET") {
            testHaveSessionOnGet(req, res, next, []);
        } else if (req.method === "POST") {
            testAndAddSession(req, res, next);
        } else {
            testHaveSession(req, res, next);
        }
    } else if (req.url === "/uploadFile") {
        testAndAddSession(req, res, next);
    } else if (req.url === "/uploadRedactedFile") {
        testHaveSession(req, res, next);
    } else if (req.url === "/parameterCalc" && req.method === "GET") {
        testAndAddSession(req, res, next);
    } else if (req.url === "/getfiles") {
        testHaveSession(req, res, next);
    } else if (url === "admin") {
        testHaveSession(req, res, next, url);
    } else if (req.url === "/basket") {
        testHaveSession(req, res, next);
    } else if (req.url === "/getUserInfo") {
        testHaveSessionOnGet(req, res, next, []);
    }
        // else if (req.url === "/admin/adminfilesget") {
        //     testHaveSession(req, res, next);
        // } else if (req.url === "/admin/getStatistics") {
        //     testHaveSession(req, res, next);
    // }
    else if (req.url === "/createOrder") {
        testHaveSession(req, res, next);
    }
        // else if (req.url === "/admin/getOrders") {
        //     testHaveSession(req, res, next);
        // } else if (req.url === "/admin/getUsers") {
        //     testHaveSession(req, res, next);
        // }
        // else if (req.url === "/admin/getSessies") {
        //     testHaveSession(req, res, next);
    // }
    else if (req.url === "/isAdmin") {
        testHaveSession(req, res, next);
    } else if (req.url === "/admin/*") {
        testHaveSession(req, res, next);
    } else if (req.url === "/api/order/create") {
        testHaveSession(req, res, next);
    }
    else {
        next();
    }
})

async function testHaveSessionOnGet(req, res, next, getForNeed) {
    try {
        if (req.cookies.to) {
            const thisSession = await Sessions.findOne({where: {session: parseInt(req.cookies.to)}});
            if (thisSession !== null) {
                req.userId = thisSession.userid
                req.sessionId = thisSession.id
                req.sessionValue = req.cookies.to
                next();
            } else {
                res.send(getForNeed);
            }
        } else {
            res.send(getForNeed);
        }
    } catch (e) {
        console.log(e);
    }
}

async function testHaveSession(req, res, next, url = "") {
    try {
        if (req.cookies.to) {
            const thisSession = await Sessions.findOne({where: {session: parseInt(req.cookies.to)}});
            if (thisSession !== null) {
                console.log(`thisSession.userid ${thisSession.userid}`);
                req.userId = thisSession.userid
                req.sessionId = thisSession.id
                req.sessionValue = req.cookies.to
                next();
            } else {
                if (req.url === "/admin" || req.url === "/isAdmin" || req.url === "/admin/#" || req.url === "/admin/") {
                    res.redirect("/login")
                } else {
                    res.sendStatus(401);
                }
            }
        } else {
            if (url === "admin" || req.url === "/isAdmin") {
                res.redirect("/login")
            } else {
                res.sendStatus(401);
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function addUserDataToReq(req, res, next) {
    try {
        if (req.cookies.to) {
            const thisUser = await Users.findOne({where: {id: parseInt(req.userId)}});
            if (thisUser !== null) {
                req.user = thisUser
                next();
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

async function testAndAddSession(req, res, next) {
    try {
        let data = 0
        if (req.cookies.to) {
            data = [parseInt(req.cookies.to)]
        }

        const thisSession = await Sessions.findOne({where: {session: data}});
        console.log(thisSession);
        if (thisSession !== null) {
            req.userId = thisSession.userid
            req.sessionId = thisSession.id
            req.sessionValue = req.cookies.to
            next();
        } else {
            let lol = Date.now()
            let cookieId = Date.now() + lol
            const createdSession = await Sessions.create({
                session: cookieId,
                userAgent: req.header('user-agent'),
                ip: req.ip,
                userid: 0,
            });
            req.sessionId = createdSession.id
            req.sessionValue = cookieId
            req.userId = 0
            res.cookie('to', cookieId.toString())

            next();
        }
    } catch (e) {
        console.log(e);
    }
}

// app.use("/admin", express.static(__dirname + "/front/admin"));
// app.use("/3dtest", express.static(__dirname + "/admin/3dtest"));
// app.use("/red", express.static(__dirname + "/admin/image-editor/examples"));

// app.post("/uploadFile", async function (req, res) {
//     let fstream;
//     req.pipe(req.busboy);
//     req.busboy.on('file', function (fieldname, file, filename) {
//         let filenameToNorm = utf8.decode(filename.filename)
//         console.log("Uploading file: " + filenameToNorm);
//
//         try {
//             let fieldnameId = parseInt(fieldname)
//             if(isNaN(fieldnameId)){
//                 let data = [fieldname, "A4", "Йде обробка: " + filenameToNorm, `/files/data/processing.jpg`, req.sessionValue, true, 1, 0];
//                 let sql = "INSERT INTO files(calc, format, name, path, session, img, count, orderid) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
//                 let connection = mysql.createConnection(configSQLConnection);
//                 connection.query(sql, data, function (err, results) {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         console.log("ФАЙЛ " + results.insertId + " " + filenameToNorm + " добавлен");
//                         allAfterUpload.afterFileLoad(req, res, results, filenameToNorm, fstream, fieldname, file, configSQLConnection);
//                         log.addStatistics(req.userId, req.sessionId, "upLoad file", "success", results.insertId, configSQLConnection, filenameToNorm)
//                     }
//                 });
//                 connection.end();
//             } else {
//                 console.log(fieldnameId);
//                 let results = {insertId: fieldnameId}
//                 allAfterUpload.afterFileLoad(req, res, results, filenameToNorm, fstream, fieldname, file, configSQLConnection);
//                 log.addStatistics(req.userId, req.sessionId, "upLoad file", "success", results.insertId, configSQLConnection, filenameToNorm)
//
//             }
//         } catch (e) {
//             console.log(e);
//         }
//     });
// });
//
// app.post("/uploadRedactedFile", async function (req, res) {
//     let fstream;
//     req.pipe(req.busboy);
//     req.busboy.on('file', function (idForFile, file) {
//         let folder1 = __dirname + `/files/${req.cookies.to}/${idForFile}/red`
//         try {
//             if (!fs.existsSync(folder1)) {
//                 fs.mkdirSync(folder1)
//             }
//         } catch (err) {
//             console.error(err)
//         }
//         let filePath = path.join(__dirname + `/files/${req.cookies.to}/${idForFile}/red/file`);
//         fstream = fs.createWriteStream(filePath);
//         file.pipe(fstream);
//         fstream.on('close', function () {
//             console.log(`cookie : ${req.cookies.to}, Uploading redacted file: ${idForFile}`);
//             let data = [`/files/${req.cookies.to}/${idForFile}/red/file`, idForFile]
//             let sql = "UPDATE files SET path=? WHERE id = ?";
//             let connection = mysql.createConnection(configSQLConnection);
//             connection.query(sql, data, function (err) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log("ФАЙЛ " + idForFile + " отредактированный сохранен");
//                     res.send(`/files/${req.cookies.to}/${idForFile}/red/file`);
//                     log.addStatistics(req.userId, req.sessionId, "upLoad redacted file", "success", idForFile, configSQLConnection, 0)
//                 }
//             });
//             connection.end();
//         });
//     });
// });

// app.get("/parameterCalc", async function (req, res) {
//     let calc = req.query.calc;
//     let paper = req.query.paper;
//     let destiny = req.query.destiny;
//     let format = req.query.format;
//
//     let data = [calc, "A4", "БЕЗ ФАЙЛУ " + calc, `/files/data/notfile2.png`, req.sessionId, true, paper, destiny, format, 1];
//     let sql = "INSERT INTO files(calc, format, name, path, session, img, paper, destiny, format, count) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
//     let connection = mysql.createConnection(configSQLConnection);
//     connection.query(sql, data, function (err, results) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("БЕЗ ФАЙЛУ " + results.insertId + " добавлена");
//
//             res.redirect("/");
//             log.addStatistics(req.userId, req.sessionId, "add nonFile 'file' (for link)", "success", results.insertId, configSQLConnection, 0)
//         }
//     });
//     connection.end();
// });

app.get("/files*", async function (req, res) {
    let urll = req.url;
    files.sendRes(urll, getContentType.getContentType(urll), res)
});
app.get("/admin/files*", testHaveSession, addUserDataToReq, async function (req, res) {
    let urll = req.url.substr(6);
    files.sendRes(urll, getContentType.getContentType(urll), res)
});
app.post("/orders", testHaveSession, addUserDataToReq, async function (req, res) {
    let body = [];
    try {
        req.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', async () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body)
            console.log(`add order without file, calc type: ${body.data.calc}`);

            let nameService = getNameService(body.data.calc)
            console.log(nameService);

            const createdFile = await Files.create({
                calc: body.data.calc,
                format: "A4",
                name: nameService,
                path: `/files/data/notfile2.png`,
                session: req.sessionValue,
                img: true,
                count: 1,
                countInFile: 1,
                orderid: 0,
                price: "0,00",
                sides: "one",
                color: "bw",
                x: 210,
                y: 297,
            });
            let ress = {
                url: `/files/data/notfile2.png`,
                img: true,
                red: false
            }
            let order = {
                calc: body.data.calc,
                count: 1,
                id: createdFile.id,
                name: `${nameService}`,
                format: "A4",
                countInFile: 1,
                url: ress,
                price: "0",
                sides: "one",
                color: "bw",
                x: 210,
                y: 297
            }
            res.send(order)
            log.addStatistics(req.userId, req.sessionId, "add nonFile 'file'", "success", createdFile.id, 0, Actions)
        })
    } catch (e) {
        console.log(e.message);
    }
});
app.get("/orders", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const orders = await Files.findAll({where: {session: parseInt(req.cookies.to)}});
        let files = [];
        if (orders !== null) {
            if (orders.length > 0) {
                orders.forEach(thisFile2 => {
                    let order = {
                        id: thisFile2.id,
                        name: thisFile2.name,
                        path: thisFile2.path,
                        userid: thisFile2.userid,
                        session: thisFile2.session,
                        orderid: thisFile2.orderid,
                        img: thisFile2.img,
                        red: thisFile2.red,
                        format: thisFile2.format,
                        sides: thisFile2.sides,
                        color: thisFile2.color,
                        cower: thisFile2.cower,
                        paper: thisFile2.paper,
                        destiny: thisFile2.destiny,
                        destinyThis: thisFile2.destinyThis,
                        binding: thisFile2.binding,
                        bindingSelect: thisFile2.bindingSelect,
                        lamination: thisFile2.lamination,
                        roundCorner: thisFile2.roundCorner,
                        frontLining: thisFile2.frontLining,
                        backLining: thisFile2.backLining,
                        big: thisFile2.big,
                        holes: thisFile2.holes,
                        countInFile: thisFile2.countInFile,
                        allPaperCount: thisFile2.allPaperCount,
                        orient: thisFile2.orient,
                        stickerCutting: thisFile2.stickerCutting,
                        stickerCuttingThis: thisFile2.stickerCuttingThis,
                        x: thisFile2.x,
                        y: thisFile2.y,
                        list: thisFile2.list,
                        calc: thisFile2.calc,
                        touse: thisFile2.touse,
                        luvers: thisFile2.luvers,
                        bannerVarit: thisFile2.bannerVarit,
                        floorLamination: thisFile2.floorLamination,
                        widthLamination: thisFile2.widthLamination,
                        cuttingSamokleika: thisFile2.cuttingSamokleika,
                        price: thisFile2.price,
                        count: thisFile2.count,
                        canToOrder: thisFile2.canToOrder,
                        inBasket: thisFile2.inBasket,
                        url: {
                            url: thisFile2.path,
                            img: thisFile2.img,
                            red: thisFile2.red
                        }
                    }
                    files.push(order)
                })
                res.send(files)
            } else {
                res.send(files)
            }
        } else {
            res.send(files)
        }
    } catch (e) {
        console.log(e);
    }
});

app.put("/orders", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        updateFileAwait2(req, res, body, prices, Files, Actions)
    } catch (e) {
        let sendData = {
            status: "error",
            error: "notParseBody"
        }
        res.send(sendData);
    }
});

app.delete("/orders", testHaveSession, addUserDataToReq, async function (req, res) {
    let body = [];
    try {
        const body = req.body;
            await Files.destroy({
                where: {
                    id: body.id
                }
            });
            try {
                files.filesDelete(__dirname + `/files/${req.cookies.to}/${data[0]}/`)
            } catch (e) {
                console.log(e.message);
            }
            res.send({
                status: "ok",
                id: body.id
            })
            log.addStatistics(req.userId, req.sessionId, `remove file`, "success", body.id, 0, Actions)
    } catch (e) {
        console.log(e.message);
        res.send(e)
    }
});

app.post("/login", async function (req, res) {
    try {
        const body = req.body;
            if (body.login && body.pass) {
                let user = await Users.findOne(
                    {where:
                        {
                            email: body.login
                        }
                    }
                )
                let user2 = null
                if(user){
                    if(user.dataValues){
                        if (body.pass === user.dataValues.password) {
                            user2 = user
                        }
                    }
                }
                // let user = await Users.findOne({where: {mail: "Nato", pass: "123"}})
                if (user2) {
                    console.log(user.dataValues.id);
                    let lol = Date.now()
                    let cookieId = Date.now() + lol
                    let session = await Sessions.create({
                        session: cookieId,
                        userAgent: req.header('user-agent'),
                        ip: req.ip,
                        userid: user.dataValues.id
                    })
                    if (req.cookies.to) {
                        await Sessions.destroy({
                            where: {
                                session: parseInt(req.cookies.to)
                            }
                        });
                    }
                    res.cookie('to', cookieId.toString())
                    res.send({err: "no"})
                }
            }
    } catch (e) {
        console.log(e.message);
    }
})

app.post("/admin/adminfilesget", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        files.getFilesForAdminView(req, res, body.to)
    } catch (e) {
        console.log(e.message);
        let readdirInfo = []
        let reddirUnit = {
            error: e.toString()
        }
        readdirInfo.push(reddirUnit)
        res.send(readdirInfo)
    }
})

app.get("/getprices", async function (req, res) {
    // console.log(req);
    res.send(prices)
})
app.get("/getpricesTabl", async function (req, res) {
    res.send(tableMain)
})
app.get("/getprices2", async function (req, res) {
    res.send(prices2)
})
app.get("/getpricesNew", async function (req, res) {
    res.send(pricesNew)
})
app.get("/getpricesTabl2", async function (req, res) {
    res.send(tableMain2)
})

app.get("/admin/getStatistics", testHaveSession, addUserDataToReq, async function (req, res) {
    if (req.userId !== 1) {
        res.sendStatus(401)
    } else {

    }
})

app.post("/admin/getSessies", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        getSessionAndPagesCount.getSessionsCountOfPage(req, res, body, configSQLConnection)
    } catch (e) {
        console.log(e.message);
    }
})

app.get("/isAdmin", testHaveSession, addUserDataToReq, async function (req, res) {
    if (req.userId !== 1) {
        res.redirect("/login")
    } else {
        res.redirect("/admin")
    }
})
app.delete("/logout", async function (req, res) {
    try {
        await Sessions.destroy({where: {session: req.cookies.to}})
        res.send({
            status: "ok"
        })
    } catch (err) {
        res.send({
            status: "ok"
        })
    }
})
app.get("/getUserInfo", testHaveSession, addUserDataToReq, async function (req, res) {
    res.send(req.user)
})

app.post("/admin/gettable", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        console.log(body);
        adminGetTable(req, res, body, Files, Sessions, Users, Orders, Actions, Services, Devices, Materials, Counters, Op)
    } catch (err) {
        console.log(err);
    }
})

app.post("/admin/addtotable", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        adminAddToTable(req, res, body, Files, Sessions, Users, Orders, Actions, Services, Devices, Materials)
    } catch (err) {
        console.log(err);
    }
})

app.post("/admin/redintable", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        adminRedTable(req, res, body, Files, Sessions, Users, Orders, Actions, Services, Devices, Materials)
    } catch (err) {
        console.log(err);
    }
})

app.post("/admin/deleteintable", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        adminDeleteInTable(req, res, body, Files, Sessions, Users, Orders, Actions, Services, Devices, Materials)
    } catch (err) {
        console.log(err);
    }
})

app.post("/admin/api/products", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        adminProducts(req, res, body, Files, Sessions, Users, Orders, Actions, Services, Devices, Materials, Product, ProductUnit, sequelize)
    } catch (err) {
        console.log(err);
    }
})

app.post("/api/pricing", async function (req, res) {
    try {
        const body = req.body;
        let dataToSend = await calculatingNewArtem(req, res, body, pricesNew, Materials)
        res.send(dataToSend)
    } catch (err) {
        console.log(err);
    }
})

app.post("/api/order/create", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        let dataToSend = await createOrderInCash(req, res, body, pricesNew, Materials, Order, OrderUnit, sequelize, calculating)
        // console.log("dataToSend!!!");
        // console.log(dataToSend);
        res.send(dataToSend)
    } catch (err) {
        console.log(err);
    }
})

app.post("/api/order/get", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        let dataToSend = await getAllOrders(req, res, body, pricesNew, Materials, Order, OrderUnit, Users, Product, ProductUnit)
        res.send(dataToSend)
    }
     catch (err) {
        console.log(err);
    }
})
app.post("/api/order/save", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        let dataToSend = await saveOrder1(req, res, body, pricesNew, Materials, Order, OrderUnit, Users, Product, ProductUnit, calculating)
        res.send(dataToSend)
    }
    catch (err) {
        console.log(err);
    }
})

app.post("/api/task/execute", async (req, res) => {
    try {
        const taskDetails = req.body;  // Дані задачі з клієнта
        // Тут ви робите всю необхідну серверну логіку:
        // обробка, маніпуляція з об'єктами, виконання обчислень

        let result = await handleTask(taskDetails);

        res.status(200).json(result);  // Повернення результату клієнту
    } catch (error) {
        console.error("Помилка виконання задачі: ", error);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

app.post("/api/order/addThing", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        let dataToSend = await NewaddThingToOrder(req, res, body, pricesNew, Materials, Order, OrderUnit, Users, Product, ProductUnit, calculating)
        res.send(dataToSend)
    }
    catch (err) {
        console.log(err);
    }
})

app.post("/api/eav", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        let dataToSend = await InterfaceEAV(req, res, body, pricesNew)
        res.send(dataToSend)
    }
    catch (err) {
        console.log(err);
    }
})
app.post("api/orders", testHaveSession, addUserDataToReq, async function (req, res) {
    try {
        const body = req.body;
        let dataToSend = await InterfaceEAV(req, res, body, pricesNew)
        res.send(dataToSend)
    }
    catch (err) {
        console.log(err);
    }
})

async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync(
            // {force: true}
        )
        // await createElementalStructure()
        // await sequelize2.authenticate();
        // await sequelize.authenticate();
        // console.log('Connection has been established successfully.');
        // await sequelize.sync(
        //     {force: true}
        // );
        // await sequelize2.sync(
        //     {force: true}
        // );
        console.log("All models were synchronized successfully.");
        readPrices()
        readPrices2()
        readPricesNew()
        startServer()
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
//original: error: оператор не существует: integer ~~ unknown
start()

function startServer() {
    let options = {
        // key: fs.readFileSync(__dirname + "/data/sslZero/key.txt"),
        key: fs.readFileSync(__dirname + "/data/sslZero/private.key"),
        // cert: fs.readFileSync(__dirname + "/data/sslTheHost/mainCert.txt"),
        cert: fs.readFileSync(__dirname + "/data/sslZero/certificate.crt"),
        // ca: fs.readFileSync(__dirname + "/data/sslTheHost/CABUNDLE.txt")
        ca: fs.readFileSync(__dirname + "/data/sslZero/ca_bundle.crt")
    };
    const httpsServer = https.createServer(options, app);
    const httpServer = http.createServer(app);
    try {
        httpServer.listen(port, () => {
            console.log('HTTPS server running on port ' + port);
        });
    } catch (e) {
        console.log("Server start for 10 second..");
        setTimeout(() => {
            startServer()
        }, 10000);
    }
}

// require('greenlock-express')
//     .init({
//         packageRoot: __dirname,
//         configDir: './greenlock.d',
//
//         // Обов'язково змініть на ваше доменне ім'я
//         sites: [
//             {
//                 subject: 'calc.printpeaks.com.ua',
//                 altnames: ['calc.printpeaks.com.ua']
//             }
//         ],
//
//         // Змініть на ваш email
//         maintainerEmail: 'Bymbarawko@gmail.com',
//
//         // Перемкніть на 'production' після тестування
//         cluster: false,
//         staging: true
//     })
//     .serve(app);

// const axios = require('axios');
// const data = JSON.stringify({
//     api_token: "your_api_token_here",
//     num_fiscal: 123456789,
//     // reservation_data: "BASE64_encoded_data_here",
//     reservation_data: {
//         "products": [
//             {
//                 "id": 1,
//                 "name": "Назва товару 1",
//                 "price": 100.00,
//                 "total_amount": 200.00,
//                 "quantity": 2
//             },
//             {
//                 "id": 2,
//                 "name": "Назва товару 2",
//                 "price": 150.00,
//                 "total_amount": 150.00,
//                 "quantity": 1
//             }
//         ]
//     },
// });
//
// axios.post('https://prro.tax.gov.ua:443/api/operation', data, {
//     headers: {
//         'Content-Type': 'application/json'
//     }
// })
//     .then(response => {
//         console.log('Response:', response.data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

// const encodedString = "d2luZG93LmxvY2F0aW9uLnJlcGxhY2UoItC60L7RgNC+0YfQtSDRgtGD0YIg0L3Rg9C20L3QviDQsNC/0Lgg0LrRg9C00LAg0L/QvtC70L7QttC40YjRjCDQstC40YDRg9GB0L3Rj9C6INCx0LvRj9GC0Ywg0Lgg0L7QvSDQt9Cw0L/Rg9GB0YLQuNGCKCIp";
//
// const decodedString = Buffer.from(encodedString, 'utf-8').toString('base64');
//
// console.log(decodedString);

// app.get('/.well-known/pki-validation/', (req, res) => {
//     res.sendFile(path.resolve(__dirname, './data', 'EB241136EE0B5129AD1CAFA92EBD467F.txt'));
// });

// app.get('/.well-known/pki-validation/EB241136EE0B5129AD1CAFA92EBD467F.txt', (req, res) => {
//     const filePath = path.resolve(__dirname, './data', 'EB241136EE0B5129AD1CAFA92EBD467F.txt');
//     res.setHeader('Content-Disposition', 'attachment; filename="EB241136EE0B5129AD1CAFA92EBD467F.txt"');
//     res.sendFile(filePath);
// });
// Add your additional code here