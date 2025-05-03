let main = document.querySelector("#main");
let files = document.querySelector("#files");
let toHome = document.querySelector("#toHome");
// let users = document.querySelector("#users");
let prices = document.querySelector("#prices");
// let functions = document.querySelector("#functions");
let filesContainer = document.querySelector("#filesContainer");
let tbodyFileContainer = document.querySelector("#tbodyFileContainer");
// let path = document.querySelector("#path");
let goBackButton = document.querySelector("#goBackButton");
let goHomePathButton = document.querySelector("#goHomePathButton");
let pathContainer = document.querySelector("#pathContainer");
let errorAlert = document.querySelector("#errorAlert");
let dropdownMenu = document.querySelector("#dropdownMenu");
let iframe = document.querySelector("#iframe");
let headerMenuButtons = document.querySelector("#headerMenuButtons");
let pricesContainer = document.querySelector("#pricesContainer");
let pricesTableHeaderContainer = document.querySelector("#pricesTableHeaderContainer");
let statistics = document.querySelector("#statistics");

// users.addEventListener('click', e => {
//     filesContainer.classList.add("d-none")
// })
// functions.addEventListener('click', function() {
//     filesContainer.classList.add("d-none")
// })

toHome.addEventListener("click", function () {
    errorAlert.classList.add("d-none")
    filesContainer.classList.add("d-none")
    listsContainer.classList.add("d-none")
    tabl2.classList.add("d-none")
    tabl1.classList.add("d-none")
    statisticsContainer.classList.add("d-none")
})


async function sendData(url, method, data) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/octate-stream'
            // 'Content-Type': 'multipart/form-data'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
        body: data // body data type must match "Content-Type" header
    });
    console.log(response);
    if(response.status === 200){
        let res = await response.json()
        return await res;
    } else if(response.status === 401){
        location.href = '/login';
    } else {
        showError(response)
    }

    // return await res; // parses JSON response into native JavaScript objects
}

let toast = new bootstrap.Toast($("#liveToast"))
const toastBody = document.querySelector("#toastBody");
const toastHeader = document.querySelector("#toastHeader");
function showError(error) {
    toastHeader.innerText = error.status
    toastBody.innerText = error.error
    toast.show()
}