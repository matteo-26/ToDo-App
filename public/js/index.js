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


var delElement = document.querySelectorAll(".delete");

delElement.forEach(function(element) {
    element.addEventListener("click", function () {
        var passId = this.getAttribute("id");

        fetch("/delete", {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                passId: passId
            })
        }).then(() => {
            window.location.href = "/";
        });
    });
});