let sessions = document.querySelector("#sessions");
let listsContainer = document.querySelector("#listsContainer");
let tabl2 = document.querySelector("#tabl2");
let tabl1 = document.querySelector("#tabl1");
let tableBody = document.querySelector("#tableBody");
let nameService = document.querySelector("#nameService");
let tableTitle = document.querySelector("#tableTitle");

sessions.addEventListener("click", function (){
    filesContainer.classList.add("d-none")
    listsContainer.classList.remove("d-none")
    tabl2.classList.add("d-none")
    tabl1.classList.add("d-none")
    statisticsContainer.classList.add("d-none")
    tableBody.classList.remove("d-none")
    nameService.innerText = "Активні сессії"
    tableTitle.innerHTML = `<th class="borderTablElem" scope="col"><div class="btn">ID</div></th>
                            <th class="borderTablElem" scope="col"><div class="btn">sessonValue</div></th>
                            <th class="borderTablElem" scope="col"><div class="btn">userAgent</div></th>
                            <th class="borderTablElem" scope="col"><div class="btn">IP</div></th>
                            <th class="borderTablElem" scope="col"><div class="btn">time</div></th>
                            <th class="borderTablElem" scope="col"><div class="btn">userID</div></th>
                            <th class="borderTablElem" scope="col"><div class="btn">del</div></th>`
    getData("Активні сессії")
})
function createTime(timeStr){
    let thisTime = new Date(parseInt(timeStr));
    let timeHours = add0ToTime(thisTime.getHours().toString())
    let timeMinutes = add0ToTime(thisTime.getMinutes().toString())
    let timeSeconds = add0ToTime(thisTime.getSeconds().toString())
    let realMoth = thisTime.getMonth()+1
    let timeMonth = add0ToTime(realMoth.toString())
    let timeString = `${thisTime.getDate()}.${timeMonth}.${thisTime.getFullYear()}, ${timeHours}:${timeMinutes}:${timeSeconds}`
    return timeString
}
function createOnlyTime(timeStr){
    let thisTime = new Date(parseInt(timeStr));
    let timeHours = add0ToTime(thisTime.getHours().toString())
    let timeMinutes = add0ToTime(thisTime.getMinutes().toString())
    let timeSeconds = add0ToTime(thisTime.getSeconds().toString())
    let timeString = `${timeHours}:${timeMinutes}:${timeSeconds}`
    return timeString
}
function add0ToTime(str){
    if(str.length < 2){
        return `0${str}`
    } else {
        return str
    }
}

function renderSessionsItem(e){
    e.data.data.forEach(o => {
        let tr = document.createElement("tr");
        // tr.classList.add("trColumn");
        // tr.classList.add("color");
        let innerHTML = `<td class="borderTablElem"><div class="btn btn-sm">${o.id}</div></td>
                            <td class="borderTablElem"><div class="btn btn-sm ">${o.session}</div></td>
                            <td class="borderTablElem"><div class="btn btn-sm  userAgent">${o.userAgent}</div></td>
                            <td class="borderTablElem"><div class="btn btn-sm ">${o.ip}</div></td>
                            <td class="borderTablElem"><div class="btn btn-sm ">${createTime(o.time)}</div></td>
                            <td class="borderTablElem"><div class="btn btn-sm ">${o.userid}</div></td>
                            <td class="borderTablElem">
                                <button class="btn btn-sm btn-danger" itemId="${o.id}" onclick=del(event.target)>close</button>
                            </td>         
                            `;
        tr.innerHTML = innerHTML;
        tableBody.append(tr);
    })
}

function del(target) {
    console.log(target.getAttribute("sesId"));
    sendData("/admin/getSessies", "DELETE", JSON.stringify(target.getAttribute("itemId"))).then(e => {
        console.log(e);
        if(e.toString() === target.getAttribute("itemId").toString()){
            target.parentElement.parentElement.remove()
        }
    })
}