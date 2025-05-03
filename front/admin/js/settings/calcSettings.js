const calcSettings = document.querySelector("#calcSettings");

calcSettings.addEventListener("click", (event) => {
    listsContainer.classList.add("d-none")
    tabl2.classList.add("d-none")
    tabl1.classList.add("d-none")
    filesContainer.classList.add("d-none")
    statisticsContainer.classList.add("d-none")
    settingsContainer.classList.remove("d-none")
})