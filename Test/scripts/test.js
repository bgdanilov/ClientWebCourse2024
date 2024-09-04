"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const content = document.querySelector(".content");
    console.log(content.innerHTML);

    let edited = document.querySelector('p[contentEditable = "true"]').textContent;
    console.log(edited);
});