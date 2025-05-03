function renderDigitalCalc(priceCalc){
    if(thisFile.format === "A4" || thisFile.format === "A3"){
        thisFile.realCount = thisFile._count*thisFile.countInFile
        let paperPrice = getPriceFromCountPaper(thisFile.destiny)
        let laminationPrice = getPriceFromCount(thisFile.lamination, "Ламінування", thisFile.format)
        if(!isNaN(paperPrice) && paperPrice !== undefined){
            priceCalc = paperPrice*thisFile.realCount
        }
        if(!isNaN(laminationPrice) && laminationPrice !== undefined){
            let lamPrice = laminationPrice*thisFile.realCount
            priceCalc = priceCalc + lamPrice
        }
    }
    else {
        let sss = Math.ceil(thisFile._count*thisFile.countInFile / getHowInASheet())
        thisFile.realCount = sss
        let paperPrice = getPriceFromCountPaper(thisFile.destiny)
        let laminationPrice = getPriceFromCount(thisFile.lamination, "Ламінування", thisFile.format)
        if(!isNaN(paperPrice) && paperPrice !== undefined){
            priceCalc = paperPrice*sss;
        }
        if(!isNaN(laminationPrice) && laminationPrice !== undefined){
            let lamPrice = laminationPrice*sss
            priceCalc = priceCalc + lamPrice;
        }
    }
    let bigPrice = getPriceFromCount(thisFile.big, "згиби")*thisFile.allPaperCount
    let holesPrice = getPriceFromCount(thisFile.holes, "отвір")*thisFile.allPaperCount
    let roundCornerPrice = getPriceFromCount(thisFile.roundCorner, "кути")*thisFile.allPaperCount
    let cowerPrice = getPriceFromCount(thisFile.cower, "обкладинка")*thisFile.allPaperCount



    let bindingPrice = getBindingFromPaperCount("брошурування").filter(e => e[0] === thisFile.binding)

    priceCalc = priceCalc + bigPrice
    priceCalc = priceCalc + holesPrice
    priceCalc = priceCalc + roundCornerPrice
    priceCalc = priceCalc + cowerPrice
    if(bindingPrice[0]){
        priceCalc = priceCalc + bindingPrice[0][1]
    }
    // thisFile.price = priceCalc


    // console.log(getHowInASheet());
    // console.log(thisFile.realCount);
    // console.log(priceCalc);

    if(thisFile.promo){
        if(thisFile.promo.status === "accepted"){
            let percent = thisFile.price / 100 * thisFile.promo.percent
            // thisFile.price = priceCalc - fivePercent
            thisFile.price = thisFile.price - percent
        }
    }
    price.value = thisFile.price

    realCount.innerText = thisFile.realCount
    destinyButtons.innerHTML = ""
    roundCornerButtons.innerHTML = ""
    roundCornerButtons.classList.remove("d-none")
    // holesButtons.innerHTML = ""
    holesButtons.classList.remove("d-none")
    // bigButtons.innerHTML = ""
    bigButtons.classList.remove("d-none")
    laminationButtons.innerHTML = ""
    laminationButtons.classList.remove("d-none")
    bindingSelectButtons.innerHTML = ""
    bindingSelectButtons.classList.remove("d-none")
    // bindingButtons.innerHTML = ""
    bindingButtons.classList.remove("d-none")
    cowerButtons.innerHTML = ""
    cowerButtons.classList.remove("d-none")
    frontLiningButtons.innerHTML = ""
    frontLiningButtons.classList.remove("d-none")
    backLiningButtons.innerHTML = ""
    backLiningButtons.classList.remove("d-none")

    stickerCutting.innerHTML = ""
    stickerCutting.classList.remove("d-none")
    stickerCuttingThis.innerHTML = ""
    stickerCuttingThis.classList.remove("d-none")

    backLiningText.innerText = ""
    backLiningText.classList.remove("d-none")
    paperButtons.innerHTML = ""

    renderOptions("на чому друк", "paper", paperButtons, "materialButtons")
    renderOptions(thisFile.paper, "destiny", destinyButtons, "destinyButtons")

    //all dop opt render -----------------------------------------------------------------------------------------
    bigButtonsAccordionButton.innerText = `Зігнути: без згибання`
    Array.prototype.slice.call(bigButtons.children).forEach(o => {
        if(o.getAttribute("toFile") === thisFile.big){
            o.classList.add("activeChose")
            bigButtonsAccordionButton.innerText = `Зігнути: ${thisFile.big}`
        } else {
            o.classList.remove("activeChose")
        }
    })
    holesButtonsAccordionButton.innerText = `Дірки: без дірок`
    Array.prototype.slice.call(holesButtons.children).forEach(o => {
        if(o.getAttribute("toFile") === thisFile.holes){
            o.classList.add("activeChose")
            holesButtonsAccordionButton.innerText = `Дірки: ${thisFile.holes}`
        } else {
            o.classList.remove("activeChose")
        }
    })
    if(thisFile.roundCorner === undefined || thisFile.roundCorner === null){
        thisFile.roundCorner = "без обрізки кутів"
    }
    roundCornerButtonsAccordionButton.innerText = `Обрізка/скруглення кутів: ${thisFile.roundCorner}`
    renderOptions("кути", "roundCorner", roundCornerButtons)

    if(thisFile.lamination === undefined || thisFile.lamination === null){
        thisFile.lamination = "без ламінації"
    }
    laminationButtonsAccordionButton.innerText = `Ламінуванння: ${thisFile.lamination}`
    renderOptions("ламінуванння", "lamination", laminationButtons)
    //all dop opt render ------------------------------------------------------------------------------------------

    if(thisFile.paper === "Папір/Картон"){
        stickerCuttingAccordion.classList.add("d-none")
        laminationButtonsAccordion.classList.remove("d-none")
        bindingButtonsAccordion.classList.remove("d-none")
        holesButtonsAccordion.classList.remove("d-none")
        roundCornerButtonsAccordion.classList.remove("d-none")
        bigButtonsAccordion.classList.remove("d-none")

        accordionOptions.classList.remove("d-none")
        thisFile.stickerCutting = undefined
        thisFile.stickerCuttingThis = undefined

        // if(thisFile.big === undefined || thisFile.big === null){
        //     thisFile.big = "без згинання"
        // }
        // renderOptions("згиби", "big", bigButtons)

        // bigButtonsL.classList.remove("d-none")
        // if(thisFile.holes === undefined || thisFile.holes === null){
        //     thisFile.holes = "без отворів"
        // }
        // renderOptions("отвір", "holes", holesButtons)
        // holesButtonsL.classList.remove("d-none")

        // roundCornerButtonsL.classList.remove("d-none")
        // laminationButtonsL.classList.remove("d-none")

        bindingButtonsAccordionButton.innerText = `Брошурування: без брошурування`
        Array.prototype.slice.call(bindingButtons.children).forEach(o => {
            o.classList.add("d-none")
        })
        getBindingFromPaperCount("брошурування").forEach(e => {
            Array.prototype.slice.call(bindingButtons.children).forEach(o => {
                if(e[0] === o.getAttribute("toFile")){
                    o.classList.remove("d-none")
                    if(o.getAttribute("toFile") === thisFile.binding){
                        o.classList.add("activeChose")
                        bindingButtonsAccordionButton.innerText = `Брошурування: ${thisFile.binding}`
                    } else {
                        o.classList.remove("activeChose")
                    }
                }
            })
        })
        cantBinding.classList.add("d-none")
        if(thisFile.countInFile <= 1){
            cantBinding.classList.remove("d-none")
            cantBinding.innerText = "1 лист - немає можливості зшити. Додайте файл що має листів: 2-400."
        }
        if(thisFile.countInFile > 401){
            cantBinding.classList.remove("d-none")
            cantBinding.innerText = thisFile.countInFile+" листів - дуже багато. Додайте файл що має листів: 2-400."
        }

        // if(thisFile.binding === undefined || thisFile.binding === null){
        //     thisFile.binding = "без брошурування"
        // }
        // if(getBindingFromPaperCount("брошурування") !== undefined){
        //     getBindingFromPaperCount("брошурування").forEach(e => {
        //         let elem = document.createElement("div")
        //         elem.innerText = e[0]
        //         elem.classList.add("btn")
        //         if(e[0] === "на пластикову" || e[0] === "на металеву" || e[0] === "прошивка дипломних робіт"){
        //             elem.addEventListener("click", function () {
        //                 thisFile.bindingSelect = undefined
        //                 thisFile.cower = undefined
        //                 thisFile.binding = elem.innerText
        //                 thisFile.renderSettings()
        //             })
        //         }
        //         else {
        //             elem.addEventListener("click", function () {
        //                 thisFile.bindingSelect = undefined
        //                 thisFile.cower = undefined
        //                 thisFile.binding = elem.innerText
        //                 thisFile.renderSettings()
        //             })
        //         }
        //         if(e[0] === thisFile.binding){
        //             elem.classList.add("btnm-act")
        //         }
        //         bindingButtons.appendChild(elem)
        //         bindingButtonsL.classList.remove("d-none")
        //     })
        // }

        // renderOptions(thisFile.binding, "bindingSelect", bindingSelectButtons)
        // bindingSelectButtonsL.classList.remove("d-none")


        // if(thisFile.binding === "на пластикову" || thisFile.binding === "на металеву"){
        //     backLiningText.classList.remove("nonDisplay");
        //     frontLiningButtons.classList.remove("nonDisplay");
        //     backLiningButtons.classList.remove("nonDisplay");
        //     if(thisFile.bindingSelect !== undefined){
        //         if(thisFile.cower === undefined){
        //             thisFile.cower = "без обкладинки"
        //         }
        //         renderOptions("обкладинка", "cower", cowerButtons)
        //         // cowerButtonsL.classList.remove("d-none")
        //
        //         backLiningText.innerText = "з задньою подкладкою"
        //         if(thisFile.frontLining === undefined){
        //             thisFile.frontLining = "з прозорою лицьовою підкладкою"
        //         }
        //         renderOptions("лицьова підкладка", "frontLining", frontLiningButtons)
        //         // frontLiningButtonsL.classList.remove("d-none")
        //
        //         if(thisFile.backLining === undefined){
        //             thisFile.backLining = ""
        //         }
        //
        //         renderOptions("задньою підкладкою", "backLining", backLiningButtons)
        //         // backLiningButtonsL.classList.remove("d-none")
        //     }
        // }
    }
    else if(thisFile.paper === "Самоклеючі"){
        accordionOptions.classList.remove("d-none")
        stickerCuttingAccordion.classList.remove("d-none")
        laminationButtonsAccordion.classList.remove("d-none")
        bindingButtonsAccordion.classList.add("d-none")
        holesButtonsAccordion.classList.remove("d-none")
        roundCornerButtonsAccordion.classList.remove("d-none")
        bigButtonsAccordion.classList.remove("d-none")
        thisFile.bindingSelect = undefined
        thisFile.binding = undefined
        thisFile.cower = undefined
        thisFile.frontLining = undefined
        thisFile.backLining = undefined

        if(thisFile.stickerCutting === undefined){
            thisFile.stickerCutting = "без порізки"
        }
        renderOptions("порізка самоклейки", "stickerCutting", stickerCutting)
        // stickerCuttingL.classList.remove("d-none")
        renderOptions(thisFile.stickerCutting, "stickerCuttingThis", stickerCuttingThis)
        // stickerCuttingThisL.classList.remove("d-none")
    }
    else {
        accordionOptions.classList.add("d-none")
        thisFile.lamination = undefined
        thisFile.bindingSelect = undefined
        thisFile.binding = undefined
        thisFile.cower = undefined
        thisFile.frontLining = undefined
        thisFile.backLining = undefined
        thisFile.big = undefined
        thisFile.holes = undefined
        thisFile.roundCorner = undefined
        thisFile.stickerCutting = undefined
    }
}