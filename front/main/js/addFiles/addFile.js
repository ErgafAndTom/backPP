let addFileButton2 = document.querySelector("#addFileButton");
let upload2 = document.querySelector("#upload2");
let fileInput2 = document.querySelector("#fileInput2");
let progressbar2 = document.querySelector("#progressbar2");
let uploadLoad2 = document.querySelector("#uploadLoad2");
let nonUpload2 = document.querySelector("#nonUpload2");
let updateCountInFile = document.querySelector("#updateCountInFile");

addFileButton2.addEventListener("click", function (){
    $("#exampleModal2").modal("show")
})
upload2.addEventListener("click", function (){
    if (fileInput2.value) {
        uploadFile(fileInput2, true, thisFile._id)
        fileInput2.classList.remove("notValid")
        // data-bs-dismiss="modal"
    } else {
        event.preventDefault()
        fileInput2.classList.add("notValid")
    }
})

function uploadFile(fileInput, isExist, id) {
    download.classList.remove("d-none");
    mainDisplay.classList.add("d-none");
    digitalPrintingContainer.classList.add("d-none");
    if (fileInput.files[0]) {
        // document.querySelector("#download").classList.remove("d-none")
        let config = {
            headers: {'Content-Type': 'multipart/form-data'},
            onUploadProgress(progressEvent) {
                const progress = progressEvent.loaded / progressEvent.total * 100
                progressbar2.value = progress
                if (progress >= 100) {
                    uploadLoad2.classList.remove("d-none");
                    upload2.classList.add("d-none");
                    nonUpload2.classList.add("d-none");
                }
            },
            data: {
                calc: calcType
            },
        };
        let fd = new FormData();

        fd.append(id, fileInput.files[0], fileInput.files[0].name)
        axios.post("/uploadFile", fd, config)
            .then(e => {
                for (let i = 0; i < allFiles.length; i++) {
                    if(allFiles[0]._id === e.data.id){
                        allFiles[0].pick({target: allFiles[0].container})
                    }
                }
                mainDisplay.classList.add("d-none")
                digitalPrintingContainer.classList.remove("d-none")
                thisFile.url = e.data.url
                thisFile.canToOrder = e.data.canToOrder
                thisFile.countInFile = e.data.countInFile
                thisFile.container.innerText = e.data.name;

                let cancelButton = document.createElement('div');
                cancelButton.onmousedown = thisFile.deleteThis.bind(thisFile);
                cancelButton.classList.add('btn-close');
                thisFile.container.appendChild(cancelButton);

                thisFile.renderSettings()
                // document.querySelector("#download").classList.add("d-none")

                uploadLoad2.classList.add("d-none");
                upload2.classList.remove("d-none");
                nonUpload2.classList.add("d-none");

                progressbar2.value = 0
                download.classList.add("d-none");
                digitalPrintingContainer.classList.remove("d-none");
                toHomeButton.classList.remove("d-none");
                toFilesButton.classList.add("d-none");
                $("#exampleModal").modal("hide")
                $("#exampleModal2").modal("hide")
            })
    }
}

countInFile.addEventListener("change", function (e){
    if(thisFile.canToOrder){
        countInFile.value = thisFile.countInFile
    } else {
        if(countInFile.value > 0){
            let data = {
                id: thisFile._id,
                parameter: "countInFile",
                value: countInFile.value
            }
            sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
                if (o.status === "ok") {
                    thisFile.countInFile = countInFile.value
                    thisFile.price = o.price
                    thisFile.renderSettings()
                } else {
                    showError(o)
                }
            })


        } else {
            countInFile.value = thisFile.countInFile
        }
    }
})