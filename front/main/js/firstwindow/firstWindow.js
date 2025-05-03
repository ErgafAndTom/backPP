const cupPrint = document.querySelector("#cupPrint")
const afterPrint = document.querySelector("#afterPrint")
// const photoPrint = document.querySelector("#photoPrint")
const widescreenPrint = document.querySelector("#widescreenPrint")
const digitalPrint = document.querySelector("#digitalPrint")

digitalPrint.addEventListener("click", event => {
    activateModal()
    fileClassCalcToModal.innerHTML = "Цифровий друк"
    calcType = "digital"
    upload.classList.remove("d-none")
    fileLoadModalBody.classList.remove("d-none")
    history.pushState({}, '');
    nonUploadFunc()
})
widescreenPrint.addEventListener("click", event => {
    activateModal()
    fileClassCalcToModal.innerHTML = "Широкоформатний друк"
    calcType = "wide"
    upload.classList.remove("d-none")
    fileLoadModalBody.classList.remove("d-none")
    history.pushState({}, '');
    nonUploadFunc()
})

photoPrint.on('click', function() {
    // photoCalc.removeClass('d-none');
    // mainDisplay.classList.add('d-none');
    activateModal()
    fileClassCalcToModal.innerHTML = "Друк на чашках"
    calcType = "photo"
    upload.classList.remove("d-none")
    fileLoadModalBody.classList.remove("d-none")
    history.pushState({}, '');
    // $("#exampleModal").modal("show")
    nonUploadFunc()
})

cupPrint.addEventListener("click", function (){
    activateModal()
    fileClassCalcToModal.innerHTML = "Друк на чашках"
    calcType = "cup"
    upload.classList.remove("d-none")
    fileLoadModalBody.classList.remove("d-none")
    history.pushState({}, '');
    // $("#exampleModal").modal("show")
    nonUploadFunc()
})

afterPrint.addEventListener("click", function (){
    activateModal()
    fileClassCalcToModal.innerHTML = "Післядрукарська обробка"
    calcType = "afterPrint"
    upload.classList.add("d-none")
    fileLoadModalBody.classList.add("d-none")
    history.pushState({}, '');
    // $("#exampleModal").modal("show")
    nonUploadFunc()
})