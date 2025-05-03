let allOrders = document.querySelector("#allOrders");
let countInPage = document.querySelector("#countInPage");
let paginationContainer = document.querySelector("#paginationContainer");
let currentPage = 1;

allOrders.addEventListener("click", function (e){
    filesContainer.classList.add("d-none")
    listsContainer.classList.remove("d-none")
    tabl2.classList.add("d-none")
    tabl1.classList.add("d-none")
    statisticsContainer.classList.add("d-none")
    tableBody.classList.remove("d-none")
    nameService.innerText = "Усі замовлення"
    tableTitle.innerHTML = `<th class="borderTablElem" scope="col"><div class="btn">Номер(id)</div></th>
                            <th class="borderTablElem" scope="col"><div class="btn">userId</div></th>
                            <th class="borderTablElem" scope="col"><div class="btn">Ім'я</div></th>
                            <th class="borderTablElem" scope="col"><div class="btn">phone</div></th>
                            <th class="borderTablElem" scope="col"><div class="btn">Статус</div></th>
                            <th class="borderTablElem" scope="col"><div class="btn">Виконавець(userId)</div></th>
                            <th class="borderTablElem" scope="col"><div class="btn">Коли замовили</div></th>
                            <th class="borderTablElem" scope="col"><div class="btn">Файли</div></th>
                            <th class="borderTablElem" scope="col"><div onclick="adminCreateOrder(event.target)" class="btn btn-sm btn-secondary">+</div></th>`

    getData("Зробленні замовлення")
})

// function delOrder(target) {
//     console.log(target.getAttribute("sesId"));
//     sendData("/getSessies", "DELETE", JSON.stringify(target.getAttribute("sesId"))).then(e => {
//         console.log(e);
//         if(e.toString() === target.getAttribute("sesId").toString()){
//             target.parentElement.parentElement.remove()
//         }
//     })
// }

function adminCreateOrder(target) {
    // console.log(target.getAttribute("sesId"));
    sendData("/admin/createOrder", "POST", JSON.stringify(target.getAttribute("1"))).then(e => {
        console.log(e);
        if(e.status === "ok"){
            getData("Зробленні замовлення")
        } else {
            showError(e)
        }
    })
}

function showData(target) {
    // console.log(target.getAttribute("sesId"));
    // sendData("/getSessies", "DELETE", JSON.stringify(target.getAttribute("sesId"))).then(e => {
    //     console.log(e);
    //     if(e.toString() === target.getAttribute("sesId").toString()){
    //         target.parentElement.parentElement.remove()
    //     }
    // })
}

function doProcessing(target) {
    console.log(target.getAttribute("itemId"));
    sendData("/admin/createOrder", "PUT", JSON.stringify(target.getAttribute("itemId"))).then(e => {
        if(e.status === "ok"){
            getData("Зробленні замовлення")
        } else {
            showError(e)
        }
    })
}

function showUser(target) {
    // console.log(target.getAttribute("sesId"));
    // sendData("/getSessies", "DELETE", JSON.stringify(target.getAttribute("sesId"))).then(e => {
    //     console.log(e);
    //     if(e.toString() === target.getAttribute("sesId").toString()){
    //         target.parentElement.parentElement.remove()
    //     }
    // })
}

function renderOrdersItem(res){
    res.data.data.forEach(o => {
        let tr = document.createElement("tr");
        // tr.classList.add("trColumn");
        // tr.classList.add("color");
        let innerHTML = ""
        if(o.executorId === undefined){
            innerHTML = `<td class="borderTablElem"><div class="btn btn-sm">${o.id}</div></td>
                            <td class="borderTablElem">
                                <button class="btn btn-sm " itemId="${o.id}" onclick=showUser(event.target)>${o.userid}</button>
                            </td>
                            <td class="borderTablElem">
                                <button class="btn btn-sm " itemId="${o.id}" onclick=showUser(event.target)>${o.user.name}</button>
                            </td>
                            
                            <td class="borderTablElem">
                                <button class="btn btn-sm " itemId="${o.id}" onclick=showUser(event.target)>${o.user.phone}</button>
                            </td>
                            
                            
                            <td class="borderTablElem"><div class="btn btn-sm">${o.status}</div></td>
                            <td class="borderTablElem" itemId="${o.id}">
                                <button class="btn btn-sm " itemId="${o.id}" onclick=doProcessing(event.target)>Виконувати</button>
                            </td>
                            <td class="borderTablElem"><div class="btn btn-sm">${createTime(o.timeCreate)}</div></td>
                            <td class="borderTablElem">
                                <button class="btn btn-sm" itemId="${o.id}" onclick=showData(event.target)>файли(${o.files.length})</button>
                            </td>
                            <td class="borderTablElem">
                                <button class="btn btn-sm btn-danger disabled" itemId="${o.id}" onclick=delOrder(event.target)>X</button>
                            </td>         
                            `;
        } else {
            innerHTML = `<td class="borderTablElem"><div class="btn btn-sm">${o.id}</div></td>
                            <td class="borderTablElem">
                                <button class="btn btn-sm" itemId="${o.id}" onclick=showUser(event.target)>${o.userid}</button>
                            </td>
                            <td class="borderTablElem">
                                <button class="btn btn-sm " itemId="${o.id}" onclick=showUser(event.target)>${o.user.name}</button>
                            </td>
                            
                            <td class="borderTablElem">
                                <button class="btn btn-sm " itemId="${o.id}" onclick=showUser(event.target)>${o.user.phone}</button>
                            </td>
                            
                            
                            <td class="borderTablElem"><div class="btn btn-sm">${o.status}</div></td>
                            <td class="borderTablElem"><div class="btn btn-sm">${o.executorId}</div></td>
                            <td class="borderTablElem"><div class="btn btn-sm">${createTime(o.timeCreate)}</div></td>
                            <td class="borderTablElem">
                                <button class="btn btn-sm " itemId="${o.id}" onclick=showData(event.target)>файли(${o.files.length})</button>
                            </td>
                            <td class="borderTablElem">
                                <button class="btn btn-sm btn-danger disabled" itemId="${o.id}" onclick=delOrder(event.target)>X</button>
                            </td>         
                            `;
        }
        tr.innerHTML = innerHTML;
        tableBody.append(tr);

        // tableBody.innerHTML = tableBody.innerHTML+innerHTML
    });
}