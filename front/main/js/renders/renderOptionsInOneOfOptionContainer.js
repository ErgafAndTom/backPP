function renderOptions(varOfServFromTable, thisFileProp, renderIn, classCss = "q"){
    let thisOpt = getVariantsFromNameInData(varOfServFromTable);
    if(thisOpt !== undefined){
        thisOpt.forEach(e => {
            if(e[0][0] !== "!"){
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.setAttribute("toFile", e[0]);
                elem.classList.add("btn")
                elem.classList.add(classCss)
                elem.addEventListener("click", function () {
                    let data = {
                        id: thisFile._id,
                        parameter: thisFileProp,
                        value: elem.getAttribute("toFile")
                    }
                    sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
                        if(o.status === "ok"){
                            Object.defineProperty(thisFile, thisFileProp, {
                                value: elem.getAttribute("toFile"),
                                writable: true
                            });
                            thisFile.price = o.price
                            thisFile.renderSettings()
                        } else {
                            showError(o)
                        }
                    })
                })
                if(e[0] === Object.getOwnPropertyDescriptor(thisFile, thisFileProp).value){
                    elem.classList.add("btnAct");
                }
                renderIn.appendChild(elem)
            }
        })
    }
}