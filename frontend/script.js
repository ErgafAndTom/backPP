const logsDiv = document.getElementById('logs');

window.logAPI.onLog((line) => {
    logsDiv.innerText += line;
    logsDiv.scrollTop = logsDiv.scrollHeight;
});