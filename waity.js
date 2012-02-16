(function (window, document, undefined) {

    function $(id) {
        return document.getElementById(id);
    }

    var spinner = {
        "lines": 12,
        "outerRadius": 50,
        "innerRadius": 30,
        "width": 3,
        "speed": 2
    };

    for (var prop in spinner) {
        if (spinner.hasOwnProperty(prop)) {
            $(prop).addEventListener('change', function () {
                this.previousSibling.previousSibling.innerHTML = this.value;
                spinner.lines = this.value;
                buildSpinner(spinner);
            });
        }
    }

    function buildSpinner(s) {

        $('spinner').src = '';
    }

    buildSpinner(spinner);

})(window, document)