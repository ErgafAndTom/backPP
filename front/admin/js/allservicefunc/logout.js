let logout = document.querySelector("#logout");

logout.addEventListener("click", function (e){
    sendData("/logout", "DELETE").then(res => {
        location.href = '/login';
    })
})