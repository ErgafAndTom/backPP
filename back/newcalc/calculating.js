const {Materials} = require("../modelDB");
/**
 * Adds two numbers and returns their sum.
 *
 * @returns {number} The sum of the two numbers.
 * @param req
 * @param res
 * @param body
 * @param pricesNew
 * @param Materials
 */
module.exports = async function calculating(req, res, body, pricesNew, Materials) {

    if(body.type === "SheetCut") {
        const selectedPaper = pricesNew[1].variants.find(material => {
            return material[0] === body.material.material
        });
        const drukBW = pricesNew[2].variants.find(material => {
            return material[0] === "цифраШтBw"
        });
        const drukColor = pricesNew[2].variants.find(material => {
            return material[0] === "цифраШтColor"
        });
        const druk1 = pricesNew[2].variants.find(material => {
            return material[0] === body.color.allSidesColor
        });
        const selectedLamination = pricesNew[3].variants.find(material => {
            return material[0] === body.lamination.type
        });
        const selectedBig = pricesNew[5].variants.find(material => {
            return material[0] === 1
        });
        const selectedCute = pricesNew[6].variants.find(material => {
            return material[0] === 1
        });
        const selectedHoles = pricesNew[7].variants.find(material => {
            return material[0] === 1
        });

        let skolkoListovNaOdin = getHowInASheet(body.size.x, body.size.y)
        let skolko = Math.ceil(parseInt(body.count) / skolkoListovNaOdin)

        let priceForThisUnit = 0;

        let priceForThisUnitOfPapper = getPriceFromCount(skolko, selectedPaper)
        let priceForThisUnitOfDrukBW = getPriceFromCount(skolko, drukBW)
        let priceForThisUnitOfDrukColor = getPriceFromCount(skolko, drukColor)
        let priceForThisUnitOfDruk1 = getPriceFromCount(skolko, druk1)
        let priceForThisUnitOfLamination = getPriceFromCount(skolko, selectedLamination)

        //---druk-------------------------------------------------------------
        let priceForDrukThisUnit = 0
        if (body.color.sides === 'односторонній') {
            priceForDrukThisUnit = priceForDrukThisUnit + priceForThisUnitOfDruk1
        } else if(body.color.sides === 'двосторонній'){
            priceForDrukThisUnit = priceForDrukThisUnit + priceForThisUnitOfDruk1
            priceForDrukThisUnit = priceForDrukThisUnit + priceForThisUnitOfDruk1
        }
        //----------------------------------------------------------------

        priceForThisUnit = priceForThisUnit + priceForThisUnitOfPapper
        priceForThisUnit = priceForThisUnit + priceForDrukThisUnit
        priceForThisUnit = priceForThisUnit + priceForThisUnitOfLamination

        let priceForThisUnitOfBig = 0
        let priceForThisUnitOfCute = 0
        let priceForThisUnitOfHoles = 0
        let priceForAllUnitsOfBig = 0
        let priceForAllUnitsOfCute = 0
        let priceForAllUnitsOfHoles = 0
        let totalPrice = priceForThisUnit * skolko
        if (body.big !== 'Не потрібно') {
            priceForThisUnitOfBig = getPriceFromCount(skolko, selectedBig) * body.big
            priceForAllUnitsOfBig = priceForThisUnitOfBig * body.count
            totalPrice = totalPrice + priceForAllUnitsOfBig
        }
        if (body.cute !== 'Не потрібно') {
            priceForThisUnitOfCute = getPriceFromCount(skolko, selectedCute) * body.cute
            priceForAllUnitsOfCute = priceForThisUnitOfCute * body.count
            totalPrice = totalPrice + priceForAllUnitsOfCute
        }
        if (body.holes !== 'Не потрібно') {
            priceForThisUnitOfHoles = getPriceFromCount(skolko, selectedHoles) * body.holes
            priceForAllUnitsOfHoles = priceForThisUnitOfHoles * body.count
            totalPrice = totalPrice + priceForAllUnitsOfHoles
        }
        return {
            price: totalPrice,
            priceForThisUnitOfPapper: priceForThisUnitOfPapper,
            priceForDrukThisUnit: priceForDrukThisUnit,
            priceForThisUnitOfLamination: priceForThisUnitOfLamination,
            priceForThisAllUnitsOfLamination: priceForThisUnitOfLamination * skolko,
            priceForThisUnitOfBig: priceForThisUnitOfBig,
            priceForAllUnitsOfBig: priceForAllUnitsOfBig,
            priceForThisUnitOfCute: priceForThisUnitOfCute,
            priceForAllUnitsOfCute: priceForAllUnitsOfCute,
            priceForThisUnitOfHoles: priceForThisUnitOfHoles,
            priceForAllUnitsOfHoles: priceForAllUnitsOfHoles,
            skolkoListovNaOdin: skolkoListovNaOdin,
            skolko: skolko,
        }
    } else if(body.type === "Note"){
        let skolkoListovNaOdin = getHowInASheet(body.size.x, body.size.y)
        let skolko = Math.ceil(parseInt(body.count) / skolkoListovNaOdin)

        //topCoverPrice----------------------------------------------------------------------------------------
        let topCoverPrice = 0
        let priceForTopCoverPapper = 0
        let priceForTopCoverDruk = 0
        let priceForTopCoverLamination = 0
        let topCoverPriceAll = 0
        if(body.topCover.type !== "Без"){
            const selectedTopCoverPaper = pricesNew[1].variants.find(material => {
                return material[0] === body.topCover.material
            });
            const selectedTopCoverDruk = pricesNew[2].variants.find(material => {
                return material[0] === body.topCover.color
            });
            const selectedTopCoverLamination = pricesNew[3].variants.find(material => {
                return material[0] === body.topCover.lamination
            });
            priceForTopCoverPapper = getPriceFromCount(skolko, selectedTopCoverPaper)
            priceForTopCoverDruk = getPriceFromCount(skolko, selectedTopCoverDruk)
            if(body.topCover.sides === "2"){
                priceForTopCoverDruk = priceForTopCoverDruk * 2
            }
            priceForTopCoverLamination = getPriceFromCount(skolko, selectedTopCoverLamination)
            topCoverPrice = topCoverPrice + priceForTopCoverPapper
            topCoverPrice = topCoverPrice + priceForTopCoverDruk
            topCoverPrice = topCoverPrice + priceForTopCoverLamination
            topCoverPriceAll = topCoverPrice * skolko
        }
        //topCoverPrice End ------------------------------------------------------------------------------------

        //IndoorUnitPrice----------------------------------------------------------------------------------------
        let IndoorUnitPrice = 0
        const selectedIndoorUnitPaper = pricesNew[1].variants.find(material => {
            return material[0] === body.indoorUnit.material
        });
        const selectedIndoorUnitDruk = pricesNew[2].variants.find(material => {
            return material[0] === body.indoorUnit.color
        });
        const selectedIndoorUnitLamination = pricesNew[3].variants.find(material => {
            return material[0] === body.indoorUnit.lamination
        });

        let forSkolko = parseInt(body.indoorUnit.type) * parseInt(body.count)
        let skolkoIndoorUnit = Math.ceil(forSkolko / skolkoListovNaOdin)

        let priceForIndoorUnitPapper = getPriceFromCount(skolkoIndoorUnit, selectedIndoorUnitPaper)
        let priceForIndoorUnitDruk = getPriceFromCount(skolkoIndoorUnit, selectedIndoorUnitDruk)
        if(body.indoorUnit.sides === "2"){
            priceForIndoorUnitDruk = priceForIndoorUnitDruk * 2
        }
        let priceForIndoorUnitLamination = getPriceFromCount(skolkoIndoorUnit, selectedIndoorUnitLamination)
        IndoorUnitPrice = IndoorUnitPrice + priceForIndoorUnitPapper
        IndoorUnitPrice = IndoorUnitPrice + priceForIndoorUnitDruk
        IndoorUnitPrice = IndoorUnitPrice + priceForIndoorUnitLamination
        let indoorUnitPriceAll = IndoorUnitPrice * skolkoIndoorUnit
        //IndoorUnitPrice End ------------------------------------------------------------------------------------

        //BackCoverPrice----------------------------------------------------------------------------------------
        let BackCoverPrice = 0
        let priceForBackCoverPapper = 0
        let priceForBackCoverDruk = 0
        let priceForBackCoverLamination = 0
        let BackCoverPriceAll = 0
        if(body.backCover.type !== "Без"){
            const selectedBackCoverPaper = pricesNew[1].variants.find(material => {
                return material[0] === body.backCover.material
            });
            const selectedBackCoverDruk = pricesNew[2].variants.find(material => {
                return material[0] === body.backCover.color
            });
            const selectedBackCoverLamination = pricesNew[3].variants.find(material => {
                return material[0] === body.backCover.lamination
            });
            priceForBackCoverPapper = getPriceFromCount(skolko, selectedBackCoverPaper)
            priceForBackCoverDruk = getPriceFromCount(skolko, selectedBackCoverDruk)
            if(body.backCover.sides === "2"){
                priceForBackCoverDruk = priceForBackCoverDruk * 2
            }
            priceForBackCoverLamination = getPriceFromCount(skolko, selectedBackCoverLamination)
            BackCoverPrice = BackCoverPrice + priceForBackCoverPapper
            BackCoverPrice = BackCoverPrice + priceForBackCoverDruk
            BackCoverPrice = BackCoverPrice + priceForBackCoverLamination
            BackCoverPriceAll = BackCoverPrice * skolko
        }
        //BackCoverPrice End ------------------------------------------------------------------------------------

        //FasteningPrice----------------------------------------------------------------------------------------
        let FasteningPrice = 0
        let selectedFastening;
        if(body.fastening.type === "Скоба"){
            selectedFastening = pricesNew[8].variants.find(material => {
                return material[0] === `${body.fastening.type}`
            });
        } else {
            selectedFastening = pricesNew[8].variants.find(material => {
                return material[0] === `${body.fastening.type} ${body.fastening.material}`
            });
        }
        // FasteningPrice = FasteningPrice + selectedFastening[1]
        FasteningPrice = 0
        //FasteningPrice End ------------------------------------------------------------------------------------

        let totalPrice = 0
        totalPrice = totalPrice + topCoverPriceAll
        totalPrice = totalPrice + BackCoverPriceAll
        totalPrice = totalPrice + indoorUnitPriceAll
        totalPrice = totalPrice + FasteningPrice

        return {
            price: totalPrice,
            priceForTopCoverPapper: priceForTopCoverPapper,
            priceForTopCoverDruk: priceForTopCoverDruk,
            priceForTopCoverLamination: priceForTopCoverLamination,
            topCoverPriceAll: topCoverPriceAll,

            priceForBackCoverPapper: priceForBackCoverPapper,
            priceForBackCoverDruk: priceForBackCoverDruk,
            priceForBackCoverLamination: priceForBackCoverLamination,
            BackCoverPriceAll: BackCoverPriceAll,

            priceForIndoorUnitPapper: priceForIndoorUnitPapper,
            priceForIndoorUnitDruk: priceForIndoorUnitDruk,
            priceForIndoorUnitLamination: priceForIndoorUnitLamination,
            indoorUnitPriceAll: indoorUnitPriceAll,

            FasteningPrice: FasteningPrice,


            skolkoListovNaOdin: skolkoListovNaOdin,
            skolko: skolko,
            skolkoIndoorUnit: skolkoIndoorUnit,
        }
    } else if(body.type === "Photo"){
        // let skolkoListovNaOdin = getHowInASheet(body.size.x, body.size.y)
        // let skolko = Math.ceil(parseInt(body.count) / skolkoListovNaOdin)
        const selectedPhotoFormat = pricesNew[9].variants.find(material => {
            return material[0] === body.material.material
        });
        let onePhotoPrice = getPriceFromCount(body.count, selectedPhotoFormat)
        let totalPrice = onePhotoPrice * body.count

        return {
            price: totalPrice,
            onePhotoPrice: onePhotoPrice,
            skolko: body.count
        }
    } else if(body.type === "Wide"){
        // let skolkoListovNaOdin = getHowInASheet(body.size.x, body.size.y)
        // let skolko = Math.ceil(parseInt(body.count) / skolkoListovNaOdin)
        const selectedDruk = pricesNew[2].variants.find(material => {
            return material[0] === "ширикМ2"
        });
        const selectedWideMaterial = pricesNew[8].variants.find(material => {
            return material[0] === body.material.material
        });
        let operantForChangeMM2ToM2 = 0.001
        let sizeXM2 = (body.size.x * operantForChangeMM2ToM2).toFixed(3)
        let sizeYM2 = (body.size.y * operantForChangeMM2ToM2).toFixed(3)


        let totalSizeInMM2One = (body.size.x * body.size.y).toFixed(3)
        let totalSizeInM2One = (sizeXM2 * sizeYM2).toFixed(3)
        let totalSizeInM2OneFirst = (totalSizeInMM2One * operantForChangeMM2ToM2).toFixed(3)

        let allTotalSizeInMM2 = (totalSizeInMM2One * body.count).toFixed(3)
        let allTotalSizeInM2 = (totalSizeInM2One * body.count).toFixed(3)

        let oneWideDrukPrice = getPriceFromCountForM2(allTotalSizeInM2, selectedDruk)
        let oneWideMaterialPrice = getPriceFromCountForM2(allTotalSizeInM2, selectedWideMaterial)

        let totalWideDrukPrice = oneWideDrukPrice * allTotalSizeInM2
        let totalWideMaterialPrice = oneWideMaterialPrice * allTotalSizeInM2
        let totalPrice = totalWideDrukPrice + totalWideMaterialPrice

        return {
            price: totalPrice,
            oneWideDrukPrice: oneWideDrukPrice,
            oneWideMaterialPrice: oneWideMaterialPrice,
            totalWideDrukPrice: totalWideDrukPrice,
            totalWideMaterialPrice: totalWideMaterialPrice,
            totalSizeInMM2One: totalSizeInMM2One,
            totalSizeInM2One: totalSizeInM2One,
            totalSizeInM2OneFirst: totalSizeInM2OneFirst,
            operantForChangeMM2ToM2: operantForChangeMM2ToM2,
            allTotalSizeInMM2: allTotalSizeInMM2,
            allTotalSizeInM2: allTotalSizeInM2,
            sizeXM2: sizeXM2,
            sizeYM2: sizeYM2,
            skolko: body.count
        }
    } else if(body.type === "Plotter") {
        const druk1 = pricesNew[2].variants.find(material => {
            return material[0] === "CMYK"
        });
        const selectedTypePorizka = pricesNew[10].variants.find(material => {
            return material[0] === body.material.type
        });
        let selectedPaper = pricesNew[1].variants.find(material => {
            return material[0] === body.material.material
        });
        // for (let i = 0; i < pricesNew.length; i++) {
        //     if (pricesNew[i].name === body.material.type) {
        //         selectedPaper = pricesNew[i].variants.find(material => {
        //             return material[0] === body.material.material
        //         });
        //     }
        // }
        // console.log(selectedPaper);
        const selectedMontajka = pricesNew[13].variants.find(material => {
            return material[0] === body.montajka
        });

        let skolkoListovNaOdin = getHowInASheet(body.size.x, body.size.y)
        let skolko = Math.ceil(parseInt(body.count) / skolkoListovNaOdin)

        let priceForThisUnit = 0;

        let priceForThisUnitOfPorizka = getPriceFromCount(skolko, selectedTypePorizka)
        let priceForThisUnitOfPapper = getPriceFromCount(skolko, selectedPaper)
        let priceForThisUnitOfDruk1 = getPriceFromCount(skolko, druk1)
        let priceForThisUnitOfMontajka = getPriceFromCount(skolko, selectedMontajka)

        //---druk-------------------------------------------------------------
        let priceForDrukThisUnit = 0
        if (body.color.sides === 'односторонній') {
            priceForDrukThisUnit = priceForDrukThisUnit + priceForThisUnitOfDruk1
        } else if (body.color.sides === 'двосторонній') {
            priceForDrukThisUnit = priceForDrukThisUnit + priceForThisUnitOfDruk1
            priceForDrukThisUnit = priceForDrukThisUnit + priceForThisUnitOfDruk1
        }
        //----------------------------------------------------------------

        priceForThisUnit = priceForThisUnit + priceForThisUnitOfPapper
        priceForThisUnit = priceForThisUnit + priceForDrukThisUnit
        priceForThisUnit = priceForThisUnit + priceForThisUnitOfPorizka
        priceForThisUnit = priceForThisUnit + priceForThisUnitOfMontajka

        let totalPrice = priceForThisUnit * skolko
        return {
            price: totalPrice,
            priceForThisUnitOfPapper: priceForThisUnitOfPapper,
            priceForDrukThisUnit: priceForDrukThisUnit,
            skolkoListovNaOdin: skolkoListovNaOdin,
            priceForThisUnitOfPorizka: priceForThisUnitOfPorizka,
            priceForThisUnitOfMontajka: priceForThisUnitOfMontajka,
            skolko: skolko,
        }
    }


    // let dataForChars = []
    // for (let i = 0; i < 2000; i++) {
    //     let priceForThisUnit = 0;
    //
    //     let priceForThisUnitOfPapper = getPriceFromCount(i, selectedPaper)
    //     let priceForThisUnitOfDruk = getPriceFromCount(i, pricesNew[2].variants[0])
    //     let priceForThisUnitOfLamination = getPriceFromCount(i, selectedLamination)
    //     let priceForThisUnitOfBig = getPriceFromCount(i, selectedBig)
    //     let priceForThisUnitOfCute = getPriceFromCount(i, selectedCute)
    //     let priceForThisUnitOfHoles = getPriceFromCount(i, selectedHoles)
    //     if (body.color.sides !== 'без друку') {
    //         if (body.color.one !== '') {
    //             priceForThisUnit = priceForThisUnitOfPapper + priceForThisUnitOfDruk
    //         }
    //         if (body.color.two !== '') {
    //             priceForThisUnit = priceForThisUnit + priceForThisUnitOfPapper + priceForThisUnitOfDruk
    //         }
    //     } else {
    //         priceForThisUnit = priceForThisUnitOfPapper
    //     }
    //     priceForThisUnit = priceForThisUnit + priceForThisUnitOfLamination
    //     if (body.big !== 'Не потрібно'){
    //         priceForThisUnit = priceForThisUnit + priceForThisUnitOfBig * body.big
    //     }
    //     if (body.cute !== 'Не потрібно'){
    //         priceForThisUnit = priceForThisUnit + priceForThisUnitOfCute * body.cute
    //     }
    //     if (body.holes !== 'Не потрібно'){
    //         priceForThisUnit = priceForThisUnit + priceForThisUnitOfHoles * body.holes
    //     }
    //
    //     if (i % skolkoListovNaOdin === 0) {
    //         let unitCharts = {price: priceForThisUnit, count: i + 1}
    //         dataForChars.push(unitCharts)
    //     } else {
    //         let unitCharts = {price: priceForThisUnit, count: i + 1}
    //         dataForChars.push(unitCharts)
    //     }
    //
    //
    //     if (i === 1) {
    //         let unitCharts = {price: priceForThisUnit, count: i + 1}
    //         dataForChars.push(unitCharts)
    //     }
    //
    // }
    //
    // return dataForChars
}

function getPriceFromCount(count, data) {
    let priceOfCount = 0;
    if (data !== undefined) {
        if (count > 0 && count < 10) {
            priceOfCount = data[1]
        }
        if (count > 9 && count < 50) {
            priceOfCount = data[2]
        }
        if (count > 49 && count < 100) {
            priceOfCount = data[3]
        }
        if (count > 99 && count < 500) {
            priceOfCount = data[4]
        }
        if (count > 499) {
            priceOfCount = data[5]
        }
    }
    return priceOfCount;
}
function getPriceFromCountForM2(count, data) {
    let priceOfCount = 0;
    if (data !== undefined) {
        if (count > 0 && count < 3) {
            priceOfCount = data[1]
        }
        if (count >= 3 && count < 10) {
            priceOfCount = data[2]
        }
        if (count >= 10 && count < 20) {
            priceOfCount = data[3]
        }
        if (count >= 20 && count < 50) {
            priceOfCount = data[4]
        }
        if (count >= 50) {
            priceOfCount = data[5]
        }
    }
    return priceOfCount;
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

