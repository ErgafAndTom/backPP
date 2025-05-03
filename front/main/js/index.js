const upload = document.querySelector("#upload")
const download = document.querySelector("#download")
const modalCloseButton = document.querySelector("#modalCloseButton")
const nonUpload = document.querySelector("#nonUpload")
const ifPrintCountLists = document.querySelector("#ifPrintCountLists")
const allCountElement = document.querySelector("#allCountElement")
const addFileButton = document.querySelector("#addFileButton");
const storinki = document.querySelector("#storinki");
const list = document.querySelector(".list");
const orient = document.querySelector("#orient");
const stickerCutting = document.querySelector("#stickerCutting");
const stickerCuttingThis = document.querySelector("#stickerCuttingThis");
const arkushi = document.querySelector("#arkushi");
const primirnyk = document.querySelector("#primirnyk");
const containerForImgInServer = document.querySelector("#containerForImgInServer");
const containerForPdfInServer = document.querySelector("#containerForPdfInServer");
const settingsContainer = document.querySelector("#settingsContainer");
const mainDisplay = document.querySelector("#mainDisplay");
const digitalPrintingContainer = document.querySelector("#digitalPrintingContainer");
const selectButtonCalc = document.querySelector("#selectButtonCalc");
const fileClassCalcToModal = document.querySelector("#fileClassCalcToModal");
const toUseButtons = document.querySelector("#toUseButtons");
const destinyThisButtons = document.querySelector("#destinyThisButtons");
const toHomeButton = document.querySelector("#toHomeButton");
const toFilesButton = document.querySelector("#toFilesButton");
const photoRedactor = document.querySelector("#photoRedactor");
const luvers = document.querySelector("#luvers");
const bannerVarit = document.querySelector("#bannerVarit");
const floorLamination = document.querySelector("#floorLamination");
const widthLamination = document.querySelector("#widthLamination");
const rotateLeft = document.querySelector("#rotateLeft");
const rotateRight = document.querySelector("#rotateRight");
// const openEditor = document.querySelector("#openEditor");
const rotateNormal = document.querySelector("#rotateNormal");
const toastBody = document.querySelector("#toastBody");
const toastHeader = document.querySelector("#toastHeader");
const formatInputs = document.querySelector("#formatInputs");
const fileViewContainer = document.querySelector("#fileViewContainer");
const fileLoadModalBody = document.querySelector("#fileLoadModalBody");
const formatContainer = document.querySelector("#formatContainer");
const drukContainer = document.querySelector("#drukContainer");

const digitalCalcSelect = document.querySelector("#digitalCalcSelect");
const widelCalcSelect = document.querySelector("#widelCalcSelect");
const photoCalcSelect = document.querySelector("#photoCalcSelect");

//lines in dop opt
const laminationButtonsAccordion = document.querySelector("#laminationButtonsAccordion");
const laminationButtonsAccordionButton = document.querySelector("#laminationButtonsAccordionButton");
// const laminationButtonsL = document.querySelector("#laminationButtonsL");
const bindingButtonsAccordion = document.querySelector("#bindingButtonsAccordion");
const bindingButtonsAccordionButton = document.querySelector("#bindingButtonsAccordionButton");
// const bindingButtonsL = document.querySelector("#bindingButtonsL");
// const bindingSelectButtonsL = document.querySelector("#bindingSelectButtonsL");
// const cowerButtonsL = document.querySelector("#cowerButtonsL");
// const frontLiningButtonsL = document.querySelector("#frontLiningButtonsL");
// const backLiningTextL = document.querySelector("#backLiningTextL");
// const backLiningButtonsL = document.querySelector("#backLiningButtonsL");
const bigButtonsAccordion = document.querySelector("#bigButtonsAccordion");
const bigButtonsAccordionButton = document.querySelector("#bigButtonsAccordionButton");
// const bigButtonsL = document.querySelector("#bigButtonsL");
const holesButtonsAccordion = document.querySelector("#holesButtonsAccordion");
const holesButtonsAccordionButton = document.querySelector("#holesButtonsAccordionButton");
// const holesButtonsL = document.querySelector("#holesButtonsL");
const roundCornerButtonsAccordion = document.querySelector("#roundCornerButtonsAccordion");
const roundCornerButtonsAccordionButton = document.querySelector("#roundCornerButtonsAccordionButton");
// const roundCornerButtonsL = document.querySelector("#roundCornerButtonsL");
const stickerCuttingAccordion = document.querySelector("#stickerCuttingAccordion");
const stickerCuttingAccordionButton = document.querySelector("#stickerCuttingAccordionButton");
// const stickerCuttingThisL = document.querySelector("#stickerCuttingThisL");
// const stickerCuttingL = document.querySelector("#stickerCuttingL");
// const luversL = document.querySelector("#luversL");
// const bannerVaritL = document.querySelector("#bannerVaritL");
// const floorLaminationL = document.querySelector("#floorLaminationL");
// const widthLaminationL = document.querySelector("#widthLaminationL");
//lines in dop opt

let price = document.querySelector(".price")
const formatButtons = document.querySelector("#formatButtons");
let sidesButtons = document.querySelector("#sidesButtons");
let colorButtons = document.querySelector("#colorButtons");
let paperButtons = document.querySelector("#paperButtons");
let destinyButtons = document.querySelector("#destinyButtons")
let laminationButtons = document.querySelector("#laminationButtons")
let cowerButtons = document.querySelector("#cowerButtons")
let frontLiningButtons = document.querySelector("#frontLiningButtons")
let backLiningButtons = document.querySelector("#backLiningButtons")
let backLiningText = document.querySelector("#backLiningText")
let bindingButtons = document.querySelector("#bindingButtons")
let bindingSelectButtons = document.querySelector("#bindingSelectButtons")
let bigButtons = document.querySelector("#bigButtons")
let holesButtons = document.querySelector("#holesButtons")
let roundCornerButtons = document.querySelector("#roundCornerButtons")
let text = document.querySelector("#text")
let accordionOptions = document.querySelector("#accordionOptions")

let countInt = document.querySelector("#countInt")
let sizeX = document.querySelector("#sizeX")
let sizeY = document.querySelector("#sizeY")

let toast = new bootstrap.Toast($("#liveToast"))
let optContainer = document.querySelector(".optionsContainer")

let imgInp = document.querySelector("#imgInp")
let iframe = document.querySelector("#iframe")
let form = document.querySelector("#formmm")
let progressbar = document.querySelector("#progressbar")


let cantBinding = document.querySelector("#cantBinding")
Array.prototype.slice.call(bindingButtons.children).forEach(e => {
    e.addEventListener("click", function () {
        if(e.getAttribute("toFile")){
            if(e.getAttribute("toFile") === thisFile.binding){
                let data = {
                    id: thisFile._id,
                    parameter: "binding",
                    value: null
                }
                sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
                    if (o.status === "ok") {
                        thisFile.binding = null
                        thisFile.price = o.price
                        thisFile.renderSettings()
                    } else {
                        showError(o)
                    }
                })
            } else {
                let data = {
                    id: thisFile._id,
                    parameter: "binding",
                    value: e.getAttribute("toFile")
                }
                sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
                    if (o.status === "ok") {
                        thisFile.binding = e.getAttribute("toFile")
                        thisFile.price = o.price
                        thisFile.renderSettings()
                    } else {
                        showError(o)
                    }
                })
            }
        }
    })
});

Array.prototype.slice.call(bigButtons.children).forEach(e => {
    e.addEventListener("click", function () {
        if(e.getAttribute("toFile") === thisFile.big){
            let data = {
                id: thisFile._id,
                parameter: "big",
                value: null
            }
            sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
                if (o.status === "ok") {
                    thisFile.big = null
                    thisFile.price = o.price
                    thisFile.renderSettings()
                } else {
                    showError(o)
                }
            })
        } else {
            let data = {
                id: thisFile._id,
                parameter: "big",
                value: e.getAttribute("toFile")
            }
            sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
                if (o.status === "ok") {
                    thisFile.big = e.getAttribute("toFile")
                    thisFile.price = o.price
                    thisFile.renderSettings()
                } else {
                    showError(o)
                }
            })
        }
    })
});

Array.prototype.slice.call(holesButtons.children).forEach(e => {
    e.addEventListener("click", function () {
        if(e.getAttribute("toFile") === thisFile.holes){
            let data = {
                id: thisFile._id,
                parameter: "holes",
                value: null
            }
            sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
                if (o.status === "ok") {
                    thisFile.holes = null
                    thisFile.price = o.price
                    thisFile.renderSettings()
                } else {
                    showError(o)
                }
            })
        } else {
            let data = {
                id: thisFile._id,
                parameter: "holes",
                value: e.getAttribute("toFile")
            }
            sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
                if (o.status === "ok") {
                    thisFile.holes = e.getAttribute("toFile")
                    thisFile.price = o.price
                    thisFile.renderSettings()
                } else {
                    showError(o)
                }
            })
        }
    })
});