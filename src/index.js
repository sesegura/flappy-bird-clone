(() => {
    let e = document.createElement("div");
    e.innerHTML = "Hello, World!";

    let main = document.getElementById("main");
    main.appendChild(e);
})();
