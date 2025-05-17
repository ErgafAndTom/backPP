const { Materials, OrderUnitUnit } = require("./modelDB");
const db = require("../models");

module.exports = async function calculatingNewArtem(req, res, body, pricesNew, Materials, skidkaPercent) {
    let count;
    if(body.count === "" || body.count === null || body.count === undefined){
        count = 1
    } else {
        count = parseInt(body.count, 10);
    }
    if (body.type === "SheetCut" || body.type === "SheetCutBW") {
        let selectedPaper = null;
        if (body.material.materialId) {
            selectedPaper = await Materials.findOne({
                where: {
                    id: parseInt(body.material.materialId, 10)
                }
            });
        }

        // === Вибір матеріалу для друку ===
        let selectedDruk = null;
        let isDrukA4 = false; // прапорець для визначення A4 (одиничний лист)
        if (body.color.sides !== "Не потрібно") {
            if (body.type === "SheetCutBW") {
                if (
                    body.size.x === 210 &&
                    body.size.y === 297 &&
                    body.material.thickness === "Офісний"
                ) {
                    selectedDruk = await Materials.findOne({
                        where: {
                            type: "Друк",
                            typeUse: "Чорнобілий",
                            x: "210",
                            y: "297"
                        }
                    });
                    isDrukA4 = true;
                } else {
                    selectedDruk = await Materials.findOne({
                        where: {
                            type: "Друк",
                            typeUse: "Чорнобілий",
                            x: "297",
                            y: "420"
                        }
                    });
                }
            } else {
                if (
                    body.size.x === 210 &&
                    body.size.y === 297 &&
                    body.material.thickness === "Офісний"
                ) {
                    selectedDruk = await Materials.findOne({
                        where: {
                            type: "Друк",
                            typeUse: "Кольоровий",
                            x: "210",
                            y: "297"
                        }
                    });
                    isDrukA4 = true;
                } else {
                    selectedDruk = await Materials.findOne({
                        where: {
                            type: "Друк",
                            typeUse: "Кольоровий",
                            x: "310",
                            y: "440"
                        }
                    });
                }
            }
        }

        // === Вибір ламінації ===
        let selectedLamination = null;
        if (body.lamination.type !== "Не потрібно") {
            selectedLamination = await Materials.findOne({
                where: {
                    id: body.lamination.materialId
                }
            });
        }

        // === Вибір постпресових операцій ===
        let selectedBig = null;
        if (body.big !== "Не потрібно") {
            selectedBig = await Materials.findOne({
                where: {
                    type: "Постпресс",
                    typeUse: "Згинання"
                }
            });
        }

        let selectedCute = null;
        if (body.cute !== "Не потрібно") {
            selectedCute = await Materials.findOne({
                where: {
                    type: "Постпресс",
                    typeUse: "Скруглення кутів"
                }
            });
        }

        let selectedHoles = null;
        if (body.holes !== "Не потрібно") {
            selectedHoles = await Materials.findOne({
                where: {
                    type: "Постпресс",
                    typeUse: "Cвердління отворів"
                }
            });
        }

        // === Розрахунок кількості аркушів для друку (sheetCount) ===
        let sheetsPerUnit = 1;
        let sheetCount = count; // використовується для паперу, друку, ламінації
        if (!isDrukA4) {
            sheetsPerUnit = getHowInASheet(body.size.x, body.size.y);
            // Функція getReciprocal повертає коефіцієнт для перерахунку з кількості одиниць у кількість аркушів
            sheetCount = Math.ceil(count * getReciprocal(sheetsPerUnit));
        }

        // === Розрахунок вартості для друку, паперу та ламінації (за sheetCount) ===
        let priceDrukPerSheet = 0;
        if (body.color.sides === 'односторонній') {
            priceDrukPerSheet = parseFloat(getPriceFromCountFromDatabase(sheetCount, selectedDruk));
        } else if (body.color.sides === 'двосторонній') {
            // При двосторонньому друку враховуємо, що друкуємо вдвічі
            let priceDouble = parseFloat(getPriceFromCountFromDatabase(sheetCount * 2, selectedDruk));
            priceDrukPerSheet = priceDouble * 2;
        }

        let pricePaperPerSheet = parseFloat(getPriceFromCountFromDatabase(sheetCount, selectedPaper));
        let priceLaminationPerSheet = parseFloat(getPriceFromCountFromDatabase(sheetCount, selectedLamination));

        // === Обчислення додаткової послуги "Порізка" ===
        // Збільшення вартості друку та паперу на 10% для розрахунку надбавки

        // Сумарна вартість для кожного аркуша (друк, папір, ламінація)
        const unitSheetPrice = pricePaperPerSheet + priceDrukPerSheet + priceLaminationPerSheet;
        const totalSheetPrice = unitSheetPrice * sheetCount;

        // === Розрахунок вартості постпресових послуг (за count) ===
        const countUnits = count;
        let priceBigUnit = 0,
            priceCuteUnit = 0,
            priceHolesUnit = 0;
        let priceBigUnitForOne = 0,
            priceCuteUnitForOne = 0,
            priceHolesUnitForOne = 0;
        let totalPriceBig = 0,
            totalPriceCute = 0,
            totalPriceHoles = 0;

        if (body.big !== 'Не потрібно') {
            priceBigUnit = parseFloat(getPriceFromCountFromDatabase(countUnits, selectedBig));
            priceBigUnitForOne = priceBigUnit * body.big;
            totalPriceBig = priceBigUnit * body.big * countUnits;
        }

        if (body.cute !== 'Не потрібно') {
            priceCuteUnit = parseFloat(getPriceFromCountFromDatabase(countUnits, selectedCute));
            priceCuteUnitForOne = priceCuteUnit * body.cute;
            totalPriceCute = priceCuteUnit * body.cute * countUnits;
        }

        if (body.holes !== 'Не потрібно') {
            priceHolesUnit = parseFloat(getPriceFromCountFromDatabase(countUnits, selectedHoles));
            priceHolesUnitForOne = priceHolesUnit * body.holes;
            totalPriceHoles = priceHolesUnit * body.holes * countUnits;
        }

        // === Підсумкова вартість замовлення ===
        let totalPriceForOne = unitSheetPrice + priceBigUnitForOne + priceCuteUnitForOne + priceHolesUnitForOne;
        let totalPriceForAllInPriceForOne = totalPriceForOne + countUnits;
        let totalPrice = totalSheetPrice + totalPriceBig + totalPriceCute + totalPriceHoles;

        // Розрахунок ціни за виріб (зі всіма допами)
        const priceForItemWithExtras = totalPrice / countUnits;

        // Розрахунок ціни за лист (лише матеріал та друк)
        const priceForSheetMaterialPrint = pricePaperPerSheet + priceDrukPerSheet;

        // Розрахунок ціни за лист (зі всіма допами)
        const postpressExtrasTotal = totalPriceBig + totalPriceCute + totalPriceHoles;
        const postpressCostPerItem = postpressExtrasTotal / countUnits;
        const postpressCostPerSheet = postpressCostPerItem * sheetsPerUnit;
        const priceForSheetWithExtras = unitSheetPrice + postpressCostPerSheet;

        let porizka = 0;
        if (body.porizka && body.porizka.type !== "Не потрібно") {
            const adjustedPriceDruk = priceDrukPerSheet * 1.1;
            const adjustedPricePaper = pricePaperPerSheet * 1.1;
            const extraDruk = adjustedPriceDruk - priceDrukPerSheet;
            const extraPaper = adjustedPricePaper - pricePaperPerSheet;
            porizka = extraDruk + extraPaper;
            totalPrice = totalPrice + porizka;
        }
        let listsFromBd;
        if(isDrukA4){
            listsFromBd = "(A4)"
        } else {
            listsFromBd = "(SR A3)"
        }

        return {
            // Не округлюємо проміжні значення – округлення проводимо на рівні відображення
            price: totalPrice.toFixed(2),
            unitSheetPrice,
            porizka,
            totalPriceForOne,
            totalPriceForAllInPriceForOne,
            pricePaperPerSheet,
            totalSheetPrice,
            priceDrukPerSheet,
            totalDrukPrice: priceDrukPerSheet * sheetCount,
            priceLaminationPerSheet,
            totalLaminationPrice: priceLaminationPerSheet * sheetCount,
            big: {
                count: body.big !== 'Не потрібно' ? body.big * countUnits : 0,
                pricePerUnit: priceBigUnit,
                totalPrice: totalPriceBig
            },
            cute: {
                count: body.cute !== 'Не потрібно' ? body.cute * countUnits : 0,
                pricePerUnit: priceCuteUnit,
                totalPrice: totalPriceCute
            },
            holes: {
                count: body.holes !== 'Не потрібно' ? body.holes * countUnits : 0,
                pricePerUnit: priceHolesUnit,
                totalPrice: totalPriceHoles
            },
            sheetsPerUnit,
            sheetCount,
            selectedDruk,
            selectedPaper,
            selectedLamination,
            selectedBig,
            selectedCute,
            selectedHoles,
            priceForSheetWithExtras,
            priceForSheetMaterialPrint,
            priceForItemWithExtras,
            listsFromBd
        };
    } else if (body.type === "Wide") {
        let selectedPaper = null;
        if (body.material.materialId) {
            selectedPaper = await Materials.findOne({
                where: {
                    id: parseInt(body.material.materialId)
                }
            });
        }

// Для широкоформатного друку шукаємо матеріал з типом "Друк" та використанням "Широкоформат"
        let selectedDruk = null;
        if (body.material.materialId) {
            selectedDruk = await Materials.findOne({
                where: {
                    type: "Друк",
                    typeUse: "Широкоформат"
                }
            });
        }

// === Розрахунок розмірів та площ ===
        let operantForChangeMM2ToM2 = 0.001;
        let sizeXM2 = (body.size.x * operantForChangeMM2ToM2).toFixed(3);
        let sizeYM2 = (body.size.y * operantForChangeMM2ToM2).toFixed(3);

// Обчислюємо площу одного аркуша у мм² та переводимо в м²
        let totalSizeInMM2One = (body.size.x * body.size.y).toFixed(3);
        let totalSizeInM2One = (parseFloat(sizeXM2) * parseFloat(sizeYM2)).toFixed(3);

// Загальна площа для всіх одиниць (як у мм² та м²)
        let allTotalSizeInMM2 = (parseFloat(totalSizeInMM2One) * count).toFixed(3);
        let allTotalSizeInM2 = (parseFloat(totalSizeInM2One) * count).toFixed(3);

// === Розрахунок цін для друку та матеріалу ===
        let oneWideDrukPrice = getPriceFromCountFromDatabaseM2(allTotalSizeInM2, selectedDruk);
        let oneWideMaterialPrice = getPriceFromCountFromDatabaseM2(allTotalSizeInM2, selectedPaper);

        let totalWideDrukPrice = oneWideDrukPrice * parseFloat(allTotalSizeInM2);
        let totalWideMaterialPrice = oneWideMaterialPrice * parseFloat(allTotalSizeInM2);
        let totalPrice = totalWideDrukPrice + totalWideMaterialPrice;

// === Встановлення додаткових параметрів для сумісності з виводом другої логіки ===
// Для широкоформатного друку немає операцій ламінації або постпресових послуг, тому встановлюємо значення за замовчуванням
        let sheetsPerUnit = 1;
        let sheetCount = count;
        let priceLaminationPerSheet = 0;
        let totalLaminationPrice = 0;
        let selectedLamination = null;
        let selectedBig = null;
        let selectedCute = null;
        let selectedHoles = null;
        let priceBigUnit = 0, totalPriceBig = 0;
        let priceCuteUnit = 0, totalPriceCute = 0;
        let priceHolesUnit = 0, totalPriceHoles = 0;
        let porizka = 0;
        let listsFromBd = "(Wide Format)";

// Обчислення вартості за одиницю (аналог листа) та за виріб
        let unitSheetPrice = oneWideDrukPrice + oneWideMaterialPrice;
        let totalSheetPrice = totalPrice; // оскільки в широкоформаті кожна одиниця – це готовий виріб
        let priceForItemWithExtras = totalPrice / sheetCount;
        let priceForSheetMaterialPrint = unitSheetPrice;
        let priceForSheetWithExtras = unitSheetPrice; // додаткових операцій немає

// === Формування фінального об'єкту виводу (за аналогією з другою версією) ===
        return {
            price: totalPrice.toFixed(2),
            unitSheetPrice: parseFloat(unitSheetPrice).toFixed(2),
            porizka,
            pricePaperPerSheet: oneWideMaterialPrice,
            totalSheetPrice,
            priceDrukPerSheet: oneWideDrukPrice,
            totalDrukPrice: totalWideDrukPrice,
            priceLaminationPerSheet,
            totalLaminationPrice,
            big: {
                count: 0,
                pricePerUnit: priceBigUnit,
                totalPrice: totalPriceBig
            },
            cute: {
                count: 0,
                pricePerUnit: priceCuteUnit,
                totalPrice: totalPriceCute
            },
            holes: {
                count: 0,
                pricePerUnit: priceHolesUnit,
                totalPrice: totalPriceHoles
            },
            sheetsPerUnit,
            sheetCount,
            selectedDruk,
            selectedPaper,
            selectedLamination,
            selectedBig,
            selectedCute,
            selectedHoles,
            priceForSheetWithExtras,
            priceForSheetMaterialPrint,
            priceForItemWithExtras,
            listsFromBd,
            // Додаткові дані для налагодження та перевірки розрахунків
            totalSizeInMM2One,
            totalSizeInM2One,
            allTotalSizeInMM2,
            allTotalSizeInM2,
            operantForChangeMM2ToM2,
            sizeXM2,
            sizeYM2,
            skolko: count
        };

    }

    else if (body.type === "Photo") {
        // const selectedPhotoFormat = pricesNew[9].variants.find(material => material[0] === body.material.material);
        let selectedPhoto = null;
        if(body.material.materialId){
            selectedPhoto = await Materials.findOne({
                where: {
                    id: parseInt(body.material.materialId)
                },
            });
        }
        let priceForThisUnitOfPapper = parseFloat(getPriceFromCountFromDatabase(count, selectedPhoto));
        let totalPrice = priceForThisUnitOfPapper * count;
        if(body.photo.type !== "Не потрібно"){
            totalPrice = totalPrice + 150
        }
        let priceForDrukThisUnit = 0
        return {
            price: totalPrice.toFixed(2),
            selectedPhoto,
            priceForThisUnitOfPapper,
            photoPosluga: 150,
            skolko: count,
            priceForDrukThisUnit,
            priceForItemWithExtras: totalPrice,
            sheetsPerUnit: count,
            sheetCount: count
        };
    } else if (body.type === "BigOvshik") {
        let priceForThisUnit = 0;

        let selectedBig = null;
        if (body.big !== "Не потрібно"){
            selectedBig = await Materials.findOne({
                where: {
                    type: "Постпресс",
                    typeUse: "Згинання",
                    // thickness: body.lamination.size
                },
            });
        }
        let selectedCute = null;
        if (body.cute !== "Не потрібно"){
            selectedCute = await Materials.findOne({
                where: {
                    type: "Постпресс",
                    typeUse: "Скруглення кутів",
                    // thickness: body.lamination.size
                },
            });
        }
        let selectedHoles = null;
        if (body.holes !== "Не потрібно"){
            selectedHoles = await Materials.findOne({
                where: {
                    type: "Постпресс",
                    typeUse: "Cвердління отворів",
                    // thickness: body.lamination.size
                },
            });
        }

        let priceBigUnit = 0;
        let totalPriceBig = 0;
        let priceCuteUnit = 0;
        let totalPriceCute = 0;
        let priceHolesUnit = 0;
        let totalPriceHoles = 0;
        let priceForAllUnitsOfBig = 0;
        let priceForAllUnitsOfCute = 0;
        let priceForAllUnitsOfHoles = 0;

        let totalPrice = 0

        if (body.big !== 'Не потрібно') {
            priceBigUnit = parseFloat(getPriceFromCountFromDatabase(count, selectedBig));
            totalPriceBig = priceBigUnit * body.big * count;
            totalPrice = totalPrice + totalPriceBig;
        }

        if (body.cute !== 'Не потрібно') {
            priceCuteUnit = parseFloat(getPriceFromCountFromDatabase(count, selectedCute));
            totalPriceCute = priceCuteUnit * body.cute * count;
            totalPrice = totalPrice + totalPriceCute;
        }

        if (body.holes !== 'Не потрібно') {
            priceHolesUnit = parseFloat(getPriceFromCountFromDatabase(count, selectedHoles));
            totalPriceHoles = priceHolesUnit * body.holes * count;
            totalPrice = totalPrice + totalPriceHoles;
        }

        return {
            price: totalPrice.toFixed(2),
            priceForOneThis: priceForThisUnit * count,
            countForOneUnitOfBig: body.big,
            priceForAllUnitsOfBig,
            countForOneUnitOfCute: body.cute,
            priceForAllUnitsOfCute,
            countForOneUnitOfHoles: body.holes,
            priceForAllUnitsOfHoles,
            selectedBig,
            selectedCute,
            selectedHoles,
            priceForThisUnit,
            big: {
                count: body.big !== 'Не потрібно' ? body.big * count : 0,
                pricePerUnit: priceBigUnit,
                totalPrice: totalPriceBig.toFixed(2)
            },
            cute: {
                count: body.cute !== 'Не потрібно' ? body.cute * count : 0,
                pricePerUnit: priceCuteUnit,
                totalPrice: totalPriceCute.toFixed(2)
            },
            holes: {
                count: body.holes !== 'Не потрібно' ? body.holes * count : 0,
                pricePerUnit: priceHolesUnit,
                totalPrice: totalPriceHoles.toFixed(2)
            },
            priceForItemWithExtras: totalPrice.toFixed(2),
            sheetCount: count,
            sheetsPerUnit: count
        };
    } else if (body.type === "PerepletMet") {
        let totalPrice = 0;
        let selectedPerepletType = null;
        if (body.pereplet.type !== "Не потрібно"){
            selectedPerepletType = await Materials.findOne({
                where: {
                    id: body.pereplet.materialId,
                    // thickness: body.lamination.size
                },
            });
        }
        let priceForOneOfPereplet = parseFloat(getPriceFromCountFromDatabase(count, selectedPerepletType));
        totalPrice = totalPrice + (priceForOneOfPereplet * count);
        return {
            price: totalPrice.toFixed(2),
            priceForOneOfPereplet,
            sheetsPerUnit: count,
            sheetCount: count,
            priceForItemWithExtras: priceForOneOfPereplet,
            selectedPerepletType,
        };
    } else if (body.type === "PerepletNeMet") {
        return {
            price: 0,
        };
    } else if (body.type === "Laminator") {
        let selectedLamination = null;
        if (body.lamination.type !== "Не потрібно"){
            selectedLamination = await Materials.findOne({
                where: {
                    id: parseInt(body.lamination.materialId)
                },
            });
        }
        if (body.size.x === 210 && body.size.y === 297){

        }
        let priceForThisUnitOfLamination = parseInt(getPriceFromCountFromDatabase(parseInt(count), selectedLamination));
        return {
            price: (priceForThisUnitOfLamination * parseInt(count)).toFixed(2),
            priceForThisUnitOfLamination,
            priceForThisAllUnitsOfLamination: priceForThisUnitOfLamination * parseInt(count),
            selectedLamination,
            skolko: parseInt(count),
            sheetsPerUnit: parseInt(count),
            sheetCount: parseInt(count),
            priceForItemWithExtras: priceForThisUnitOfLamination,
            priceLaminationPerSheet: priceForThisUnitOfLamination,
            priceForSheetWithExtras: priceForThisUnitOfLamination,
        };
    } else if (body.type === "Vishichka") {
        let selectedPaper = null;
        if (body.material.materialId) {
            selectedPaper = await Materials.findOne({
                where: {
                    id: parseInt(body.material.materialId, 10)
                }
            });
        }

        let selectedVishichka = null;
        if (body.vishichka.materialId) {
            selectedVishichka = await Materials.findOne({
                where: {
                    id: parseInt(body.vishichka.materialId, 10),
                    type: "Постпресс",
                    typeUse: "Висічка"
                }
            });
        }

        let selectedDruk = null;
        let isDrukA4 = false;
        if (body.color.sides !== "Не потрібно") {
            if (body.size.x === 210 && body.size.y === 297) {
                selectedDruk = await Materials.findOne({
                    where: {
                        type: "Друк",
                        typeUse: "Кольоровий",
                        x: "210",
                        y: "297"
                    }
                });
                isDrukA4 = true;
            } else {
                selectedDruk = await Materials.findOne({
                    where: {
                        type: "Друк",
                        typeUse: "Кольоровий",
                        x: "310",
                        y: "440"
                    }
                });
            }
        }

        let sheetsPerUnit = 1;
        let sheetCount = count;
        if (!isDrukA4) {
            sheetsPerUnit = getHowInASheet(body.size.x, body.size.y);
            sheetCount = Math.ceil(count * getReciprocal(sheetsPerUnit));
        }

        let priceDrukPerSheet = 0;
        if (body.color.sides === 'односторонній') {
            priceDrukPerSheet = parseFloat(getPriceFromCountFromDatabase(sheetCount, selectedDruk));
        } else if (body.color.sides === 'двосторонній') {
            let priceDouble = parseFloat(getPriceFromCountFromDatabase(sheetCount * 2, selectedDruk));
            priceDrukPerSheet = priceDouble * 2;
        }

        let pricePaperPerSheet = parseFloat(getPriceFromCountFromDatabase(sheetCount, selectedPaper));
        let priceVishichkaPerSheet = parseFloat(getPriceFromCountFromDatabase(sheetCount, selectedVishichka));

        const unitSheetPrice = pricePaperPerSheet + priceDrukPerSheet + priceVishichkaPerSheet;
        const totalSheetPrice = unitSheetPrice * sheetCount;

        return {
            price: totalSheetPrice.toFixed(2),
            unitSheetPrice,
            pricePaperPerSheet: pricePaperPerSheet.toFixed(2),
            totalSheetPrice,
            priceDrukPerSheet: priceDrukPerSheet.toFixed(2),
            totalDrukPrice: (priceDrukPerSheet * sheetCount).toFixed(2),
            priceVishichkaPerSheet: priceVishichkaPerSheet.toFixed(2),
            totalVishichkaPrice: (priceVishichkaPerSheet * sheetCount).toFixed(2),
            sheetsPerUnit,
            sheetCount,
            selectedDruk,
            selectedPaper,
            selectedVishichka,
            priceForItemWithExtras: unitSheetPrice.toFixed(2)
        };
    } else if (body.type === "Cup") {
        let selectedCup = null;
        if(body.material.materialId){
            selectedCup = await Materials.findOne({
                where: {
                    id: parseInt(body.material.materialId)
                },
            });
        }
        let priceForThisUnit = 0
        let skolko = count
        let priceForThisUnitOfCup = parseFloat(getPriceFromCountFromDatabase(count, selectedCup));

        priceForThisUnit += priceForThisUnitOfCup;

        let priceForAllUnitOfCup = priceForThisUnitOfCup * count;

        let totalPrice = priceForThisUnit * count;
        return {
            price: totalPrice.toFixed(2),
            skolko,
            priceForThisUnit,
            priceForThisUnitOfCup,
            priceForAllUnitOfCup,
            selectedCup,
            sheetsPerUnit: 1,
            sheetCount: count,
            priceForItemWithExtras: priceForThisUnitOfCup
        };
    } else if (body.type === "Note") {
        // === Выбор материала для лицевой стороны ===
        let selectedMaterialFront = null;
        if (body.materialAndDrukFront.materialId) {
            selectedMaterialFront = await Materials.findOne({
                where: {
                    id: parseInt(body.materialAndDrukFront.materialId, 10)
                }
            });
        }

        // === Выбор материала для оборотной стороны ===
        let selectedMaterialBack = null;
        if (body.materialAndDrukBack.materialId) {
            selectedMaterialBack = await Materials.findOne({
                where: {
                    id: parseInt(body.materialAndDrukBack.materialId, 10)
                }
            });
        }

        // === Выбор ламинации для лицевой стороны ===
        let selectedLaminationFront = null;
        if (body.materialAndDrukFront.laminationType !== "Не потрібно" && body.materialAndDrukFront.laminationmaterialId) {
            selectedLaminationFront = await Materials.findOne({
                where: {
                    id: parseInt(body.materialAndDrukFront.laminationmaterialId, 10)
                }
            });
        }

        // === Выбор ламинации для оборотной стороны ===
        let selectedLaminationBack = null;
        if (body.materialAndDrukBack.laminationType !== "Не потрібно" && body.materialAndDrukBack.laminationmaterialId) {
            selectedLaminationBack = await Materials.findOne({
                where: {
                    id: parseInt(body.materialAndDrukBack.laminationmaterialId, 10)
                }
            });
        }

        // === Выбор печати для лицевой стороны ===
        let selectedDrukFront = null;
        if (body.materialAndDrukFront.drukColor !== "Не потрібно") {
            if (body.materialAndDrukFront.drukColor === "Кольоровий") {
                selectedDrukFront = await Materials.findOne({
                    where: {
                        type: "Друк",
                        typeUse: "Кольоровий",
                        x: "310",
                        y: "440"
                    }
                });
            } else if (body.materialAndDrukFront.drukColor === "Чорнобілий"){
                selectedDrukFront = await Materials.findOne({
                    where: {
                        type: "Друк",
                        typeUse: "Чорнобілий",
                        x: "297",
                        y: "420"
                    }
                });
            }
        }

        // === Выбор печати для оборотной стороны ===
        let selectedDrukBack = null;
        if (body.materialAndDrukBack.drukColor !== "Не потрібно") {
            if (body.materialAndDrukBack.drukColor === "Кольоровий") {
                selectedDrukBack = await Materials.findOne({
                    where: {
                        type: "Друк",
                        typeUse: "Кольоровий",
                        x: "310",
                        y: "440"
                    }
                });
            } else if (body.materialAndDrukBack.drukColor === "Чорнобілий"){
                selectedDrukBack = await Materials.findOne({
                    where: {
                        type: "Друк",
                        typeUse: "Чорнобілий",
                        x: "297",
                        y: "420"
                    }
                });
            }
        }
        let selectedPerepletType = null;
        if (body.pereplet.type !== "Не потрібно"){
            selectedPerepletType = await Materials.findOne({
                where: {
                    id: body.pereplet.materialId,
                    // thickness: body.lamination.size
                },
            });
        }
        let pricePereplet = parseFloat(getPriceFromCountFromDatabase((count*(2+body.materialAndDrukBack.count)), selectedMaterialFront));

        // === Расчёт количества листов ===
        // Определяем, сколько единиц помещается на одном листе
        let sheetsPerUnit = getHowInASheet(body.size.x, body.size.y);
        // Пересчёт единиц в количество листов с округлением в большую сторону
        let sheetCount = Math.ceil((count*2) * getReciprocal(sheetsPerUnit));

        // === Расчёт стоимости для лицевой стороны ===
        // Материал, печать и ламинация для лицевой стороны
        let priceMaterialFront = parseFloat(getPriceFromCountFromDatabase(sheetCount, selectedMaterialFront));
        let priceDrukFront = 0;
        if (selectedDrukFront) {
            if (body.materialAndDrukFront.drukSides === "односторонній") {
                priceDrukFront = parseFloat(getPriceFromCountFromDatabase(sheetCount, selectedDrukFront));
            } else if (body.materialAndDrukFront.drukSides === "двосторонній") {
                let priceDouble = parseFloat(getPriceFromCountFromDatabase(sheetCount * 2, selectedDrukFront));
                priceDrukFront = priceDouble * 2;
            }
        }
        let priceLaminationFront = 0;
        if (selectedLaminationFront) {
            priceLaminationFront = parseFloat(getPriceFromCountFromDatabase(sheetCount, selectedLaminationFront));
        }
        const unitSheetPriceFront = priceMaterialFront + priceDrukFront + priceLaminationFront;
        const totalSheetPriceFront = unitSheetPriceFront * sheetCount;

        // === Расчёт стоимости для оборотной стороны ===
        // Материал, печать и ламинация для оборотной стороны
        let sheetCountBack = Math.ceil((count * body.materialAndDrukBack.count) * getReciprocal(sheetsPerUnit));
        let priceMaterialBack = parseFloat(getPriceFromCountFromDatabase(sheetCountBack, selectedMaterialBack));
        let priceDrukBack = 0;
        if (selectedDrukBack) {
            if (body.materialAndDrukBack.drukSides === "односторонній") {
                priceDrukBack = parseFloat(getPriceFromCountFromDatabase(sheetCountBack, selectedDrukBack));
            } else if (body.materialAndDrukBack.drukSides === "двосторонній") {
                let priceDouble = parseFloat(getPriceFromCountFromDatabase(sheetCountBack * 2, selectedDrukBack));
                priceDrukBack = priceDouble * 2;
            }
        }
        let priceLaminationBack = 0;
        if (selectedLaminationBack) {
            priceLaminationBack = parseFloat(getPriceFromCountFromDatabase(sheetCountBack, selectedLaminationBack));
        }
        const unitSheetPriceBack = priceMaterialBack + priceDrukBack + priceLaminationBack;
        const totalSheetPriceBack = unitSheetPriceBack * sheetCountBack;

        // === Расчёт услуги переплёта (если требуется) ===
        let pricePerepletUnit = 0;
        if (body.pereplet && body.pereplet.materialId) {
            // Например, выбираем материал для переплёта по указанному типу использования
            let selectedPereplet = await Materials.findOne({
                where: {
                    id: body.pereplet.materialId,
                    // thickness: body.lamination.size
                },
            });
            pricePerepletUnit = parseFloat(getPriceFromCountFromDatabase(count * (body.materialAndDrukBack.count+1), selectedPereplet));
        }
        const totalPerepletPrice = pricePerepletUnit * count;

        // === Итоговая стоимость заказа ===
        const totalPrice = totalSheetPriceFront + totalSheetPriceBack + totalPerepletPrice;
        const priceForItemWithExtras = totalPrice / count;

        return {
            price: totalPrice.toFixed(2),
            // Детализация по лицевой стороне
            unitSheetPriceFront,
            totalSheetPriceFront,
            priceMaterialFront,
            priceDrukFront,
            priceLaminationFront,
            // Детализация по оборотной стороне
            unitSheetPriceBack,
            totalSheetPriceBack,
            priceMaterialBack,
            priceDrukBack,
            priceLaminationBack,
            // Переплёт
            pricePerepletUnit,
            totalPerepletPrice,
            // Общие данные
            sheetsPerUnit,
            sheetCount,
            sheetCountBack,
            priceForItemWithExtras,
            // Выбранные материалы и услуги
            selectedMaterialFront,
            selectedMaterialBack,
            selectedDrukFront,
            selectedDrukBack,
            selectedLaminationFront,
            selectedLaminationBack
        };

    }
};

// Helper function to get reciprocal
function getReciprocal(value) {
    if (value === 0) {
        throw new Error("Division by zero is not allowed.");
    }
    return 1 / value;
}

function getPriceFromCountFromDatabase(count, data) {
    let priceOfCount = 0;
    if (data !== null) {
        if (count > 0 && count < 10) {
            priceOfCount = data.price1;
        }
        if (count > 9 && count < 50) {
            priceOfCount = data.price2;
        }
        if (count > 49 && count < 100) {
            priceOfCount = data.price3;
        }
        if (count > 99 && count < 500) {
            priceOfCount = data.price4;
        }
        if (count > 499) {
            priceOfCount = data.price5;
        }
    }
    return priceOfCount;
}
function getPriceFromCountFromDatabaseM2(count, data) {
    let priceOfCount = 0;
    if (data !== null) {
        if (count > 0 && count < 3) {
            priceOfCount = data.price1;
        }
        if (count >= 3 && count < 10) {
            priceOfCount = data.price2;
        }
        if (count >= 10 && count < 20) {
            priceOfCount = data.price3;
        }
        if (count >= 20 && count < 50) {
            priceOfCount = data.price4;
        }
        if (count >= 50) {
            priceOfCount = data.price5;
        }
    }
    return priceOfCount;
}

function getPriceFromCount(count, data) {
    let priceOfCount = 0;
    if (data !== undefined) {
        if (count > 0 && count < 10) {
            priceOfCount = data[1];
        }
        if (count > 9 && count < 50) {
            priceOfCount = data[2];
        }
        if (count > 49 && count < 100) {
            priceOfCount = data[3];
        }
        if (count > 99 && count < 500) {
            priceOfCount = data[4];
        }
        if (count > 499) {
            priceOfCount = data[5];
        }
    }
    return priceOfCount;
}

function getPriceFromCountForM2(count, data) {
    let priceOfCount = 0;
    if (data !== undefined) {
        if (count > 0 && count < 3) {
            priceOfCount = data[1];
        }
        if (count >= 3 && count < 10) {
            priceOfCount = data[2];
        }
        if (count >= 10 && count < 20) {
            priceOfCount = data[3];
        }
        if (count >= 20 && count < 50) {
            priceOfCount = data[4];
        }
        if (count >= 50) {
            priceOfCount = data[5];
        }
    }
    return priceOfCount;
}

function getHowInASheet(x, y, xFromDatabase = 310, yFromDatabase = 440) {
    // Replace division with multiplication by reciprocals
    let xx1 = xFromDatabase * getReciprocal(x);
    let yy1 = yFromDatabase * getReciprocal(y);
    let gg1 = Math.floor(xx1) * Math.floor(yy1);

    xx1 = yFromDatabase * getReciprocal(x);
    yy1 = xFromDatabase * getReciprocal(y);
    let gg2 = Math.floor(xx1) * Math.floor(yy1);

    return Math.max(gg1, gg2);
}

function getPriceFromCount2(count, data) {
    let priceOfCount = 0;
    if (data !== undefined) {
        if (count > 0 && count < 10) {
            priceOfCount = data.price1;
        }
        if (count > 9 && count < 50) {
            priceOfCount = data.price2;
        }
        if (count > 49 && count < 100) {
            priceOfCount = data.price3;
        }
        if (count > 99 && count < 500) {
            priceOfCount = data.price4;
        }
        if (count > 499) {
            priceOfCount = data.price5;
        }
    }
    return priceOfCount;
}
