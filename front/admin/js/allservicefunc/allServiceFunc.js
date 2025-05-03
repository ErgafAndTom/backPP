function getData(){
    let data = {
        page: currentPage,
        inPageCount: parseInt(countInPage.value)
    }
    if(nameService.innerText === "Усі замовлення"){
        sendData("/admin/getOrders", "POST", JSON.stringify(data)).then(res => {
            tableBody.innerHTML = ""
            console.log(res);
            if(res.status === "ok"){
                renderOrdersItem(res)
                renderPages(res)
            } else {
                showError(res)
            }
        })
    } else if (nameService.innerText === "Активні сессії"){
        sendData("/admin/getSessies", "POST", JSON.stringify(data)).then(res => {
            console.log(res);
            tableBody.innerHTML = ""
            if(res.status === "ok"){
                renderSessionsItem(res)
                renderPages(res)
            } else {
                showError(res)
            }
        })
    } else if (nameService.innerText === "Користувачі"){
        sendData("/admin/getUsers", "POST", JSON.stringify(data)).then(res => {
            console.log(res);
            tableBody.innerHTML = ""
            if(res.status === "ok"){
                renderUsersItem(res)
                renderPages(res)
            } else {
                showError(res)
            }
        })
    }
}

countInPage.addEventListener("change", function (e){
    getData()
})

function renderPages(res){
    let backButton = `<li class="page-item colorPages"><button toPage="${currentPage-1}" onclick=toPage(event.target) class="page-link colorPages">Назад</button></li>`
    let backButtonDisabled = `<li class="page-item colorPages disabled"><button class="page-link">Назад</button></li>`
    let nextButton = `<li class="page-item colorPages"><button toPage="${currentPage+1}" onclick=toPage(event.target) class="page-link colorPages" href="#">Далі</button></li>`
    let nextButtonDisabled = `<li class="page-item colorPages disabled"><button class="page-link" href="#">Далі</button></li>`
    let resultHtml = ""
    if(res.data.pageCount === 1 || res.data.pageCount === "1"){
        resultHtml = resultHtml+backButtonDisabled
        if(res.data.page === 1){
            resultHtml = resultHtml+`<li class="page-item colorPages active"><button class="page-link colorPages" toPage="1">1</button></li>`
        } else {
            resultHtml = resultHtml+`<li class="page-item colorPages"><button onclick=toPage(event.target) class="page-link colorPages" toPage="1">1</button></li>`
        }
        resultHtml = resultHtml+nextButtonDisabled
    }
    else {
        for (let i = res.data.page-3; i < res.data.page+4; i++){
            // console.log(`i sei4as: ${i}`);
            if(i === res.data.page-3){
                if(res.data.page === 1){
                    resultHtml = resultHtml+backButtonDisabled
                } else {
                    resultHtml = resultHtml+backButton
                }
            }
            if(i === res.data.page){
                // console.log(`dobavlena active stranica: ${i}`);
                resultHtml = resultHtml+`<li class="page-item colorPages active"><button class="page-link colorPages" toPage="${i}">${i}</button></li>`

            } else {
                if(i > 0 && i <= res.data.pageCount){
                    // console.log(`dobavlena stranica: ${i}`);
                    resultHtml = resultHtml+`<li class="page-item colorPages"><button class="page-link colorPages" onclick=toPage(event.target) toPage="${i}">${i}</button></li>`
                }
            }
            if(i === res.data.page+3){
                if(res.data.page >= res.data.pageCount){
                    resultHtml = resultHtml+nextButtonDisabled
                } else {
                    resultHtml = resultHtml+nextButton
                }
            }
        }
    }
    paginationContainer.innerHTML = resultHtml
}

function toPage(e){
    currentPage = parseInt(e.getAttribute("toPage"))
    getData()
}