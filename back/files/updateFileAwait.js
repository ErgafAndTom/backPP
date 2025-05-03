const mysql = require("mysql2/promise");
const log = require("../log/log");
let thisFile;

let whiteVariables = ["format", "x", "y", "orient", "paper", "touse", "destiny", "destinyThis", "lamination",
    "cuttingSamokleika", "roundCorner", "binding", "big", "holes", "color", "sides", "count"]

module.exports = {
    updateFileAwait: async function (req, res, body, configSQLConnection, prices) {
        const connection = await mysql.createConnection(configSQLConnection);

        try {
            // Начало транзакции
            await connection.beginTransaction();
            let parameter1 = undefined;
            let parameter2 = undefined;
            let parameter3 = undefined;
            let parameter4 = undefined;
            for (let i = 0; i < whiteVariables.length; i++) {
                if(whiteVariables[i] === body.parameter){
                    parameter1 = whiteVariables[i]
                }
                if(whiteVariables[i] === body.parameter2){
                    parameter2 = whiteVariables[i]
                }
                if(whiteVariables[i] === body.parameter3){
                    parameter3 = whiteVariables[i]
                }
                if(whiteVariables[i] === body.parameter4){
                    parameter4 = whiteVariables[i]
                }
            }

            let data1 = [body.value, body.id]
            let sql1;
            if(parameter1){
                // sql1 = "UPDATE files SET " + parameter1 + "=? WHERE id = ?";
                if(parameter1 === "paper"){
                    if(body.value === "Самоклеючі"){
                        sql1 = "UPDATE files SET " + parameter1 + "=?, destiny='Біла самоклеюча плівка', format='A3', cuttingSamokleika='з фігурною порізкою (порізка продукції на аркуші форматом А3)', lamination=null, roundCorner=null, binding=null, big=null WHERE id = ?";
                    } else if(body.value === "Папір/Картон"){
                        sql1 = "UPDATE files SET " + parameter1 + "=?, destiny=null, format='A4', cuttingSamokleika=null WHERE id = ?";
                    }else if(body.value === "Інше"){
                        sql1 = "UPDATE files SET " + parameter1 + "=?, destiny=null, format='A4', cuttingSamokleika=null WHERE id = ?";
                    } else {
                        sql1 = "UPDATE files SET " + parameter1 + "=? WHERE id = ?";
                    }
                } else {
                    sql1 = "UPDATE files SET " + parameter1 + "=? WHERE id = ?";
                }
            }
            if (parameter1 && parameter2) {
                data1 = [body.value, body.value2, body.id]
                sql1 = "UPDATE files SET " + parameter1 + "=?, " + parameter2 + "=? WHERE id = ?";
            }
            if (parameter1 && parameter2 && parameter3) {
                data1 = [body.value, body.value2, body.value3, body.id]
                sql1 = "UPDATE files SET " + parameter1 + "=?, " + parameter2 + "=?, " + parameter3 + "=? WHERE id = ?";
            }
            if (parameter1 && parameter2 && parameter3 && parameter4) {
                data1 = [body.value, body.value2, body.value3, body.value4, body.id]
                sql1 = "UPDATE files SET " + parameter1 + "=?, " + parameter2 + "=?, " + parameter3 + "=?, " + parameter4 + "=? WHERE id = ?";
            }
            const [insertResult1] = await connection.execute(sql1, data1);

            let data2 = [body.id];
            let sql2 = "SELECT * from files WHERE id = ?";
            const [insertResult2] = await connection.execute(sql2, data2);
            if(insertResult2[0]){
                thisFile = insertResult2[0];
                let priceCalc = 0;
                thisFile.realCount = thisFile.count
                thisFile.allPaperCount = thisFile.count * thisFile.countInFile

                if (thisFile.format !== "custom") {
                    getSize(prices)
                } else {
                    if (thisFile.x) {
                        thisFile.x = parseInt(thisFile.x)
                    }
                    if (thisFile.y) {
                        thisFile.y = parseInt(thisFile.y)
                    }
                    if (thisFile.x < 45) {
                        thisFile.x = 45
                    }
                    if (thisFile.y < 45) {
                        thisFile.y = 45
                    }
                    if (thisFile.calc === "digital") {
                        if (body.parameter === "x") {
                            if (thisFile.x > 310) {
                                if (thisFile.y > 310) {
                                    thisFile.y = 310
                                }
                                if (thisFile.x > 440) {
                                    thisFile.x = 440
                                }
                            }
                        }
                        if (body.parameter === "y") {
                            if (thisFile.y > 310) {
                                if (thisFile.x > 310) {
                                    thisFile.x = 310
                                }
                                if (thisFile.y > 440) {
                                    thisFile.y = 440
                                }
                            }
                        }
                    }
                }

                //start main calc----------------------------------------------------------------------------------------------------------
                if (thisFile.calc === "digital") {
                    if (thisFile.format === "A4" || thisFile.format === "A3") {
                        thisFile.realCount = thisFile.count * thisFile.countInFile
                        let paperPrice = getPriceFromCountPaper(thisFile.destiny, prices)
                        let laminationPrice = getPriceFromCount(thisFile.lamination, "Ламінування", thisFile.format, prices)
                        // console.log(laminationPrice);
                        if (!isNaN(paperPrice) && paperPrice !== undefined) {
                            priceCalc = paperPrice * thisFile.realCount
                        }
                        if (!isNaN(laminationPrice) && laminationPrice !== undefined) {
                            let lamPrice = laminationPrice * thisFile.realCount
                            priceCalc = priceCalc + lamPrice
                        }
                    } else {
                        let sss = Math.ceil(thisFile.count * thisFile.countInFile / getHowInASheet())
                        realCount = sss
                        thisFile.realCount = realCount
                        let paperPrice = getPriceFromCountPaper(thisFile.destiny, prices)
                        let laminationPrice = getPriceFromCount(thisFile.lamination, "Ламінування", thisFile.format, prices)
                        if (!isNaN(paperPrice) && paperPrice !== undefined) {
                            priceCalc = paperPrice * sss;
                        }
                        if (!isNaN(laminationPrice) && laminationPrice !== undefined) {
                            let lamPrice = laminationPrice * sss
                            priceCalc = priceCalc + lamPrice;
                        }
                    }
                    let bigPrice = getPriceFromCount(thisFile.big, "згиби", "", prices) * thisFile.allPaperCount
                    let holesPrice = getPriceFromCount(thisFile.holes, "отвір", "", prices) * thisFile.allPaperCount
                    let roundCornerPrice = getPriceFromCount(thisFile.roundCorner, "кути", "", prices) * thisFile.allPaperCount
                    let cowerPrice = getPriceFromCount(thisFile.cower, "обкладинка", thisFile.format, prices) * thisFile.allPaperCount
                    let cuttingSamokleikaPrice = getPriceFromCount(thisFile.cuttingSamokleika, "Порізка самоклейки", "", prices) * thisFile.allPaperCount


                    let bindingPrice = getBindingFromPaperCount("брошурування", prices).filter(e => e[0] === thisFile.binding)

                    priceCalc = priceCalc + bigPrice
                    priceCalc = priceCalc + holesPrice
                    priceCalc = priceCalc + roundCornerPrice
                    priceCalc = priceCalc + cowerPrice
                    priceCalc = priceCalc + cuttingSamokleikaPrice
                    if (bindingPrice[0]) {
                        let bindingPriceAll = bindingPrice[0][1] * thisFile.count
                        priceCalc = priceCalc + bindingPriceAll
                    }
                    thisFile.price = priceCalc;
                } else if (thisFile.calc === "wide") {
                    let paper1 = getVariantsFromNameInData(thisFile.touse, prices);
                    let paper2 = getVariantsFromNameInData(thisFile.destiny, prices);

                    thisFile.realCount = thisFile.count*thisFile.countInFile

                    let mm = thisFile.x * thisFile.y
                    let m2kv = mm/1000000

                    if(paper1 !== undefined){
                        if(paper2 !== undefined){
                            for (let i = 0; i < paper2.length; i++) {
                                if(thisFile.destinyThis === paper2[i][0]){
                                    priceCalc = paper2[i][1] * m2kv * thisFile.realCount
                                }
                            }
                        }
                        else {
                            for (let i = 0; i < paper1.length; i++) {
                                if(thisFile.destiny === paper1[i][0]){
                                    priceCalc = paper1[i][1] * m2kv * thisFile.realCount
                                }
                            }
                        }
                    }
                    thisFile.price = priceCalc.toFixed(2);
                    //photo----------------------------------------------------------------------------------------------------------------------
                } else if (thisFile.calc === "photo"){
                    let cupPrice = getPriceFromCount(thisFile.format, "ФОТО ДРУК", undefined, prices)
                    thisFile.price = cupPrice*thisFile.count
                    //cup----------------------------------------------------------------------------------------------------------------------
                } else if (thisFile.calc === "cup") {
                    let cupPrice = getPriceFromCount(thisFile.destiny, "чашки", undefined, prices)
                    thisFile.price = cupPrice*thisFile.count
                    //afterPrint----------------------------------------------------------------------------------------------------------------------
                } else if (thisFile.calc === "afterPrint"){
                    let cupPrice = getPriceFromCount(thisFile.destiny, "Післядрукарська обробка", undefined, prices)
                    thisFile.price = cupPrice*thisFile.count
                }
                let data3 = [thisFile.price, thisFile.x, thisFile.y, body.id]
                let sql3 = "UPDATE files SET price=?, x=?, y=? WHERE id = ?";
                const [insertResult3] = await connection.execute(sql3, data3);
                let ress = {
                    url: thisFile.path,
                    img: thisFile.img,
                    red: thisFile.red
                }
                thisFile.url = ress;
                let sendData = {
                    status: "ok",
                    thisFile: thisFile
                }
                res.send(sendData);
                log.addStatistics(req.userId, req.sessionId, `update file: `+body, "success", body.id, configSQLConnection, thisFile.price)
            } else {
                res.send({
                    status: "error",
                    error: "Немає файлу котрий намагаетесь змінити"
                })
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            console.error('Ошибка во время транзакции:', error);
            res.send({
                status: "error",
                error: error
            })
        } finally {
            await connection.end();
        }
    }
}

function getVariantsFromNameInData(name, prices) {
    let paper = undefined
    for (let i = 0; i < prices.length; i++) {
        if (prices[i].name === name) {
            paper = prices[i].variants
            break;
        }
    }
    return paper
}

function getPriceFromCountPaper(name, prices) {
    let price = getProductInVariantsFromName(name, prices)
    let priceOfCount = 0;
    if (price !== undefined) {
        if (thisFile.realCount > 0 && thisFile.realCount < 10) {
            priceOfCount = price[1]
        }
        if (thisFile.realCount > 9 && thisFile.realCount < 50) {
            priceOfCount = price[2]
        }
        if (thisFile.realCount > 49 && thisFile.realCount < 100) {
            priceOfCount = price[3]
        }
        if (thisFile.realCount > 99 && thisFile.realCount < 500) {
            priceOfCount = price[4]
        }
        if (thisFile.realCount > 409) {
            priceOfCount = price[5]
        }
    }
    return priceOfCount;
}

function getProductInVariantsFromName(name, prices) {
    let price = getPaperPricesFromUserPick(prices)
    let pricePaper = undefined
    if (price !== undefined) {
        for (let i = 0; i < price.length; i++) {
            if (price[i][0] === name) {
                pricePaper = price[i]
                break;
            }
        }
    }
    return pricePaper
}

function getPaperPricesFromUserPick(prices) {
    let price = undefined
    if (thisFile.format === "A4" && thisFile.color === "bw" && thisFile.sides === "one") {
        for (let i = 0; i < prices.length; i++) {
            if (prices[i].name === "ЧБ друк A4 односторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    if (thisFile.format === "A4" && thisFile.color === "bw" && thisFile.sides === "two") {
        for (let i = 0; i < prices.length; i++) {
            if (prices[i].name === "ч/б друк А4 двосторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    if (thisFile.format === "A4" && thisFile.color === "colors" && thisFile.sides === "one") {
        for (let i = 0; i < prices.length; i++) {
            if (prices[i].name === "Колір цифровий друк А4 односторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    if (thisFile.format === "A4" && thisFile.color === "colors" && thisFile.sides === "two") {
        for (let i = 0; i < prices.length; i++) {
            if (prices[i].name === "Колір цифровий друк А4 двосторонній") {
                price = prices[i].variants
                break;
            }
        }
    }

    //experement
    if (
        thisFile.format === "A3" && thisFile.color === "bw" && thisFile.sides === "one" ||
        thisFile.format === "A5" && thisFile.color === "bw" && thisFile.sides === "one" ||
        thisFile.format === "A6" && thisFile.color === "bw" && thisFile.sides === "one" ||
        thisFile.format === "A7" && thisFile.color === "bw" && thisFile.sides === "one" ||
        thisFile.format === "custom" && thisFile.color === "bw" && thisFile.sides === "one"
    ) {
        for (let i = 0; i < prices.length; i++) {
            if (prices[i].name === "ЧБ друк A3 односторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    if (
        thisFile.format === "A3" && thisFile.color === "bw" && thisFile.sides === "two" ||
        thisFile.format === "A5" && thisFile.color === "bw" && thisFile.sides === "two" ||
        thisFile.format === "A6" && thisFile.color === "bw" && thisFile.sides === "two" ||
        thisFile.format === "A7" && thisFile.color === "bw" && thisFile.sides === "two" ||
        thisFile.format === "custom" && thisFile.color === "bw" && thisFile.sides === "two"
    ) {
        for (let i = 0; i < prices.length; i++) {
            if (prices[i].name === "ч/б друк А3 двосторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    if (
        thisFile.format === "A3" && thisFile.color === "colors" && thisFile.sides === "one" ||
        thisFile.format === "A5" && thisFile.color === "colors" && thisFile.sides === "one" ||
        thisFile.format === "A6" && thisFile.color === "colors" && thisFile.sides === "one" ||
        thisFile.format === "A7" && thisFile.color === "colors" && thisFile.sides === "one" ||
        thisFile.format === "custom" && thisFile.color === "colors" && thisFile.sides === "one"
    ) {
        for (let i = 0; i < prices.length; i++) {
            if (prices[i].name === "Колір цифровий друк А3 односторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    if (
        thisFile.format === "A3" && thisFile.color === "colors" && thisFile.sides === "two" ||
        thisFile.format === "A5" && thisFile.color === "colors" && thisFile.sides === "two" ||
        thisFile.format === "A6" && thisFile.color === "colors" && thisFile.sides === "two" ||
        thisFile.format === "A7" && thisFile.color === "colors" && thisFile.sides === "two" ||
        thisFile.format === "custom" && thisFile.color === "colors" && thisFile.sides === "two"
    ) {
        for (let i = 0; i < prices.length; i++) {
            if (prices[i].name === "Колір цифровий друк А3 двосторонній") {
                price = prices[i].variants
                break;
            }
        }
    }
    return price
}

function getSizes(prices) {
    let size = {
        x: 0,
        y: 0
    }
    for (let i = 0; i < prices.length; i++) {
        if (prices[i].name === "formats") {
            for (let o = 0; o < prices[i].variants.length; o++) {
                if (prices[i].variants[o][0] === thisFile.format) {
                    size.x = prices[i].variants[o][2]
                    size.y = prices[i].variants[o][3]
                    break;
                }
            }
            break;
        }
    }
    return size
}

function getHowInASheet() {
    let xx1 = 310 / thisFile.x
    let yy1 = 440 / thisFile.y
    let gg1 = Math.floor(xx1) * Math.floor(yy1)

    xx1 = 440 / thisFile.x
    yy1 = 310 / thisFile.y
    let gg2 = Math.floor(xx1) * Math.floor(yy1)

    let forR = 0
    if (gg1 > gg2) {
        forR = gg1
    } else {
        forR = gg2
    }
    return forR
}

function getPriceFromCount(name, nameService, format, prices) {
    let price = getProductInVariantsFromNameNotPaper(name, nameService, format, prices)
    // console.log(price)
    let priceOfCount = 0;
    if (price !== undefined) {
        if (thisFile.realCount > 0 && thisFile.realCount < 10) {
            priceOfCount = price[1]
        }
        if (thisFile.realCount > 9 && thisFile.realCount < 50) {
            priceOfCount = price[2]
        }
        if (thisFile.realCount > 49 && thisFile.realCount < 100) {
            priceOfCount = price[3]
        }
        if (thisFile.realCount > 99 && thisFile.realCount < 500) {
            priceOfCount = price[4]
        }
        if (thisFile.realCount > 409) {
            priceOfCount = price[5]
        }
    }
    return priceOfCount;
}

function getProductInVariantsFromNameNotPaper(name, nameService, format, prices) {
    let price = getVariantsFromName(nameService, format, prices)
    // console.log(price);
    let pricePaper = undefined
    if (price !== undefined) {
        for (let i = 0; i < price.length; i++) {
            if (price[i][0] === name) {
                pricePaper = price[i]
                break;
            }
        }
    }
    return pricePaper
}

function getVariantsFromName(nameService, format, prices) {
    let price = undefined
    if (format === "A4") {
        for (let i = 0; i < prices.length; i++) {
            if (prices[i].name === `${nameService} А4`) {
                price = prices[i].variants
                // console.log(price);
                break;
            }
        }
    } else if (
        format === "A3" ||
        format === "A5" ||
        format === "A6" ||
        format === "A7" ||
        format === "custom"
    ) {
        for (let i = 0; i < prices.length; i++) {
            if (prices[i].name === `${nameService} А3`) {
                price = prices[i].variants
                break;
            }
        }
    } else {
        for (let i = 0; i < prices.length; i++) {
            if (prices[i].name === `${nameService}`) {
                price = prices[i].variants
                break;
            }
        }
    }
    return price
}


//БРОШУРУВАННЯ
function getBindingFromNameAndFormat(nameService, prices) {
    let price = undefined
    if (thisFile.format === "A4") {
        for (let i = 0; i < prices.length; i++) {
            if (prices[i].name === `${nameService} A4`) {
                price = prices[i].variants
                break;
            }
        }
    } else if (
        thisFile.format === "A3"
    ) {
        for (let i = 0; i < prices.length; i++) {
            if (prices[i].name === `${nameService} A3`) {
                price = prices[i].variants
                break;
            }
        }
    }
    return price
}

function getBindingFromPaperCount(nameService, prices) {
    let price = getBindingFromNameAndFormat(nameService, prices)
    let pricePaper = []
    if (price !== undefined) {
        for (let i = 0; i < price.length; i++) {
            if (thisFile.countInFile >= price[i][2] && thisFile.countInFile <= price[i][3]) {
                pricePaper.push(price[i])
                // if(price[i][0] === name) {
                //     pricePaper = price[i]
                //     break;
                // }
            }
        }
    }
    return pricePaper
}

function getSize(prices) {
    let sizes = getSizes(prices)
    if (!thisFile.orient) {
        thisFile.x = sizes.x
        thisFile.y = sizes.y
    } else {
        thisFile.x = sizes.y
        thisFile.y = sizes.x
    }
}