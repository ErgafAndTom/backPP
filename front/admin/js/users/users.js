let users = document.querySelector("#users");

users.addEventListener("click", function (e){
    filesContainer.classList.add("d-none")
    listsContainer.classList.remove("d-none")
    tabl2.classList.add("d-none")
    tabl1.classList.add("d-none")
    statisticsContainer.classList.add("d-none")
    tableBody.classList.remove("d-none")
    nameService.innerText = "Користувачі"
    tableTitle.innerHTML = `<th class="borderTablElem" scope="col">ID</th>
                            <th class="borderTablElem" scope="col">Ім'я</th>
                            <th class="borderTablElem" scope="col">@маіл</th>
                            <th class="borderTablElem" scope="col">Повноваження</th>
                            <th class="borderTablElem" scope="col">Телефон</th>
                            <th class="borderTablElem" scope="col">Мессенджер</th>
                            <th class="borderTablElem" scope="col"></th>
                            <th class="borderTablElem" scope="col"></th>`

    getData("Користувачі")
})

function showMore(target) {
    // sendData("/getUsers", "DELETE", JSON.stringify(target.getAttribute("sesId"))).then(e => {
    //     console.log(e);
    //     if(e.toString() === target.getAttribute("sesId").toString()){
    //         target.parentElement.parentElement.remove()
    //     }
    // })
}

// countInPage.addEventListener("change", function (e){
//     getData()
// })

function renderUsersItem(res){
    res.data.data.forEach(o => {
        let tr = document.createElement("tr");
        // tr.classList.add("trColumn");
        // tr.classList.add("color");
        let innerHTML = `<td class="borderTablElem"><div class="btn">${o.id}</div></td>
                            <td class="borderTablElem"><div class="btn">${o.name}</div></td>
                            <td class="borderTablElem"><div class="btn">${o.mail}</div></td>
                            <td class="borderTablElem"><div class="btn">${o.role}</div></td>
                            <td class="borderTablElem"><div class="btn">${o.phone}</div></td>
                            <td class="borderTablElem"><div class="btn">${o.messenger}</div></td>
                            <td class="borderTablElem">
                                <button class="btn btn-danger" itemId="${o.id}" onclick=showMore(event.target)>Докладніше</button>
                            </td>         
                            `;
        tr.innerHTML = innerHTML;
        tableBody.append(tr);
    });
}