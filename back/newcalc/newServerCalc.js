const {Materials} = require("../modelDB");
module.exports = async function calculating(order) {
    // Declare an empty array to hold new data elements with their respective prices
    const ceni2 = await findAndCountAllMaterials();
    let orderorderunits = [
        {

        }
    ];












    // ---  NOW need:
    // --- add its own sub-orders(orderorderunits) to each orderunit as instance of the entity from the database at the time of this addition














    console.log(order.orderunits);
    let newDataForCalc = processUniqueItems(order.orderunits);
    let prices = calculatePrices(newDataForCalc, ceni2)
    let dataWithPrices2 = addPricesToAllUnitsInCash(order.orderunits, prices);
    let renewCalcOrder = order
    renewCalcOrder.orderunits = dataWithPrices2
    renewCalcOrder.calcResponse = [{price: prices.summ, count: 1}]
    renewCalcOrder.price = prices.summ
    renewCalcOrder.orderorderunits = orderorderunits
    return renewCalcOrder;
}

function getHowInASheet(x, y) {
    let xx1 = 310 / x
    let yy1 = 440 / y
    let gg1 = Math.floor(xx1) * Math.floor(yy1)

    xx1 = 440 / x
    yy1 = 310 / y
    let gg2 = Math.floor(xx1) * Math.floor(yy1)

    let forR = 0
    if (gg1 > gg2) {
        forR = gg1
    } else {
        forR = gg2
    }
    return forR
}

function getPriceFromCount2(count, data) {
    let priceOfCount = 0;
    if (data !== undefined) {
        if (count > 0 && count < 10) {
            priceOfCount = data.price1
        }
        if (count > 9 && count < 50) {
            priceOfCount = data.price2
        }
        if (count > 49 && count < 100) {
            priceOfCount = data.price3
        }
        if (count > 99 && count < 500) {
            priceOfCount = data.price4
        }
        if (count > 499) {
            priceOfCount = data.price5
        }
    }
    return priceOfCount;
}

function processProductUnits(item, uniqueItems) {
    if (item.OrderUnitUnits){
        item.OrderUnitUnits.forEach(subItem => {
            if (!uniqueItems[subItem.name]) {
                // uniqueItems[subItem.name] = {...subItem, amountAll: 0, idInStorageUnit: item.id, xInStorage: item.x, yInStorage: item.y};
                uniqueItems[subItem.name] = {...subItem, amountAll: 0, idInStorageUnit: item.id, xInStorage: item.x, yInStorage: item.y};
            }
            uniqueItems[subItem.name].amountAll += parseInt(subItem.quantity) * parseInt(item.amount);
        })
        if (item.OrderUnitUnits.length === 0){
            if (!uniqueItems[item.name]) {
                // uniqueItems[item.name] = {...item, amountAll: 0, idInStorageUnit: item.id, xInStorage: item.x, yInStorage: item.y};
                uniqueItems[item.name] = {...item, amountAll: 0, idInStorageUnit: item.id, xInStorage: item.x, yInStorage: item.y};
            }
            uniqueItems[item.name].amountAll += parseInt(item.amount);
        }
    }
    else {
        if (!uniqueItems[item.name]) {
            // uniqueItems[item.name] = {...item, amountAll: 0, idInStorageUnit: item.id, xInStorage: item.x, yInStorage: item.y};
            uniqueItems[item.name] = {...item, amountAll: 0, idInStorageUnit: item.id, xInStorage: item.x, yInStorage: item.y};
        }
        uniqueItems[item.name].amountAll += parseInt(item.amount);
    }
    return uniqueItems;
}
function processUniqueItems(units) {
    let uniqueItems = {}
    if(units){
        units.forEach(item => {
            uniqueItems = processProductUnits(item, uniqueItems)
        })
    }
    return Object.values(uniqueItems);
}
async function findAndCountAllMaterials() {
    return await Materials.findAndCountAll({
        offset: (1 - 1) * 99999, // Смещение для текущей страницы
        limit: 99999, // Количество записей на странице
    })
}
function calculatePrices(dataForCalc, ceni2) {
    let summ = 0;
    let dataWithPrices = [];
    for (let i = 0; i < dataForCalc.length; i++) {
        let thisTypeUnit = ceni2.rows.find(material => {
            return material.dataValues.id === parseInt(dataForCalc[i].idInStorageUnit)
        });
        let price = 0;
        if(thisTypeUnit){
            price = getPriceFromCount2(parseInt(dataForCalc[i].amountAll), thisTypeUnit.dataValues);
            dataWithPrices.push({
                ...dataForCalc[i],
                xInStorage: thisTypeUnit.dataValues.x,
                yInStorage: thisTypeUnit.dataValues.y,
                price: price * parseInt(dataForCalc[i].amountAll),
                priceOneThing: price
            });
            summ = summ + (price * parseInt(dataForCalc[i].amountAll))
        }
    }
    return { summ: summ, dataWithPrices: dataWithPrices };
}
function addPricesToAllUnitsInCash(orderUnits, prices) {
    let pricedData = orderUnits.map(item => {
        let toRet = {...item};
        // console.log(toRet);
        let sumForThisProduct = 0;
        if(!item.OrderUnitUnits){
            item.OrderUnitUnits = []
        }
        if(item.OrderUnitUnits){
            let newOrderUnits = item.OrderUnitUnits.map(subItem => {
                let toRetSub = {...subItem};
                prices.dataWithPrices.forEach(classMaterialItem => { // замінено dataWithPrices на prices.dataWithPrices
                    if (parseInt(classMaterialItem.idInStorageUnit) === parseInt(subItem.idInStorageUnit)) {
                        toRetSub.xInStorage = classMaterialItem.x
                        toRetSub.yInStorage = classMaterialItem.y
                        // toRet.idInStorageUnit = classMaterialItem.idInStorageUnit
                        if (item.newField2 && item.newField3) {
                            let amountCanPushToOneList = getHowInASheet(parseInt(item.newField2), parseInt(item.newField3));
                            let amountListForOne = Math.ceil(parseInt(item.amount) / amountCanPushToOneList);
                            toRetSub.amountCanPushToOneList = amountCanPushToOneList
                            toRetSub.amountListForOne = amountListForOne


                            toRetSub.priceForThisWithoutCalcSize = classMaterialItem.priceOneThing * parseInt(subItem.quantity);
                            toRetSub.priceForThis = classMaterialItem.priceOneThing * amountListForOne;
                            toRetSub.priceForOneThis = classMaterialItem.priceOneThing;
                        } else {
                            toRetSub.priceForThis = classMaterialItem.priceOneThing * parseInt(subItem.quantity);
                            toRetSub.priceForOneThis = classMaterialItem.priceOneThing;
                            toRetSub.priceForThisWithoutCalcSize = classMaterialItem.priceOneThing * parseInt(subItem.quantity);
                            toRet.newField2 = 0;
                            toRet.newField3 = 0;
                        }
                    }
                })
                return toRetSub;
            })
            if (item.OrderUnitUnits.length === 0) {
                prices.dataWithPrices.forEach(classMaterialItem => { // замінено dataWithPrices на prices.dataWithPrices
                    if (parseInt(classMaterialItem.idInStorageUnit) === parseInt(item.idInStorageUnit)) {
                        toRet.priceForThis = classMaterialItem.priceOneThing * parseInt(item.amount);
                        toRet.priceForOneThis = classMaterialItem.priceOneThing
                        toRet.xInStorage = classMaterialItem.x
                        toRet.yInStorage = classMaterialItem.y
                        toRet.idInStorageUnit = item.idInStorageUnit
                        if (item.newField2 && item.newField3) {
                            let amountCanPushToOneList = getHowInASheet(parseInt(item.newField2), parseInt(item.newField3));
                            let amountListForOne = Math.ceil(parseInt(item.amount) / amountCanPushToOneList);
                            toRet.amountCanPushToOneList = amountCanPushToOneList
                            toRet.amountListForOne = amountListForOne


                            toRet.priceForThisWithoutCalcSize = classMaterialItem.priceOneThing * parseInt(item.amount);
                            toRet.priceForThis = classMaterialItem.priceOneThing * amountListForOne;
                            toRet.priceForOneThis = classMaterialItem.priceOneThing;
                        } else {
                            toRet.priceForThis = classMaterialItem.priceOneThing * parseInt(item.amount);
                            toRet.priceForOneThis = classMaterialItem.priceOneThing;
                            toRet.priceForThisWithoutCalcSize = classMaterialItem.priceOneThing * parseInt(item.amount);
                            toRet.newField2 = 0;
                            toRet.newField3 = 0;
                        }
                    }
                })
            }
            // toRet.orderunits = newOrderUnits
            toRet.OrderUnitUnits = newOrderUnits
            toRet.OrderUnitUnits.forEach(productUnit => {
                sumForThisProduct = sumForThisProduct + productUnit.priceForThis * productUnit.quantity;
            });
        } else {

            // prices.dataWithPrices.forEach(classMaterialItem => { // замінено dataWithPrices на prices.dataWithPrices
            //     if (parseInt(classMaterialItem.idInStorageUnit) === parseInt(item.idInStorageUnit)) {
            //         toRet.priceForThis = classMaterialItem.priceOneThing * parseInt(item.amount);
            //         toRet.priceForOneThis = classMaterialItem.priceOneThing
            //         toRet.xInStorage = classMaterialItem.x
            //         toRet.yInStorage = classMaterialItem.y
            //         // toRet.idInStorageUnit = classMaterialItem.idInStorageUnit
            //         if (item.newField2 && item.newField3) {
            //             let amountCanPushToOneList = getHowInASheet(parseInt(item.newField2), parseInt(item.newField3));
            //             let amountListForOne = Math.ceil(parseInt(item.amount) / amountCanPushToOneList);
            //             toRet.amountCanPushToOneList = amountCanPushToOneList
            //             toRet.amountListForOne = amountListForOne
            //
            //
            //             toRet.priceForThisWithoutCalcSize = classMaterialItem.priceOneThing * parseInt(item.amount);
            //             toRet.priceForThis = classMaterialItem.priceOneThing * amountListForOne;
            //             toRet.priceForOneThis = classMaterialItem.priceOneThing;
            //         } else {
            //             toRet.priceForThis = classMaterialItem.priceOneThing * parseInt(item.amount);
            //             toRet.priceForOneThis = classMaterialItem.priceOneThing;
            //             toRet.priceForThisWithoutCalcSize = classMaterialItem.priceOneThing * parseInt(item.amount);
            //             toRet.newField2 = 0;
            //             toRet.newField3 = 0;
            //         }
            //     }
            // })
            // toRet.OrderUnitUnits = []
        }

        // toRet.priceForThis = sumForThisProduct;
        // toRet.priceForOneThis = parseInt(toRet.priceForThis) / parseInt(item.amount)
        // if (item.newField2 && item.newField3) {
        //     toRet.amountCanPushToOneList = getHowInASheet(parseInt(item.newField2), parseInt(item.newField3));
        //     toRet.amountListForOne = Math.ceil(parseInt(item.amount) / toRet.amountCanPushToOneList);
        // } else {
        //     toRet.amountCanPushToOneList = 1;
        //     toRet.amountListForOne = Math.ceil(parseInt(item.amount) / toRet.amountCanPushToOneList);
        // }
        return toRet;
    });


    return pricedData
}