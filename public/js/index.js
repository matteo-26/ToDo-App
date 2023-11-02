var actElements = document.querySelectorAll(".act");

actElements.forEach(function(element) {
element.addEventListener("click", function () {
    var passValue = this.getAttribute("data-value");

    fetch("/sendValue", {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        value: passValue
    })
    })
    
});
});