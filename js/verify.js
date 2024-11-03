function getQueryParams() {
    const params = Object.fromEntries(new URLSearchParams(location.search));
    return params;
}

var params = getQueryParams();
var verify = params.verify;
var user = params.user;
if (!verify) {
    window.location.href="index.html";
}

document.getElementById("newproject").addEventListener("click", () => {
    window.location = "create.html?user=" + user;
});
document.getElementById("checklist").addEventListener("click", () => {
    window.location = "projectlist.html?user=" + user;
});