(function (window, document, undefined) {

    function $(id) {
        return document.getElementById(id);
    }

    var spinner = {
        "lines":12,
        "outerRadius":40,
        "innerRadius":18,
        "borderRadius":1,
        "width":5,
        "revolution":1000,
        "shadow": 0
    };

    for (var prop in spinner) {
        if (spinner.hasOwnProperty(prop)) {
            $(prop).value = spinner[prop];
            $(prop).previousSibling.previousSibling.innerHTML = $(prop).value;

            $(prop).addEventListener('change', function () {
                spinner[this.id] = this.value;
                buildSpinner(spinner);
                this.previousSibling.previousSibling.innerHTML = this.value;
            });
        }
    }


    function buildSpinner(s) {

        var wrapper, svg, defs, rect, cont, ani;

        function attr(obj, attributes) {
            for (prop in attributes) {
                obj.setAttribute(prop, attributes[prop]);
            }
        }

        wrapper = document.createElement('div');

        svg = document.createElement('svg');
        attr(svg, {
            'width':s.outerRadius * 2,
            'height':s.outerRadius * 2,
            'xmlns':'http://www.w3.org/2000/svg',
            'xmlns:xlink':'http://www.w3.org/1999/xlink'});
        wrapper.appendChild(svg);

        defs = document.createElement('defs');
        svg.appendChild(defs);

        rect = document.createElement('rect');
        attr(rect, {'id':'l',
            'x':s.innerRadius,
            'y':-s.width / 2,
            'rx':s.borderRadius,
            'ry':s.borderRadius,
            'width':Math.abs(s.outerRadius - s.innerRadius),
            'height':s.width,
            'fill':'#000'
        });
        defs.appendChild(rect);

        cont = document.createElement('g');
        cont.setAttribute('transform', 'translate(' + (s.outerRadius) + ', ' + (s.outerRadius) + ')');
        svg.appendChild(cont);

        ani = document.createElement('animateTransform');
        attr(ani, {
            'attributeName':'transform',
            'calcMode':'discrete',
            'type':'rotate',
            'values':'0;30;60;90;120;150;180;210;240;270;300;330;360',
            'additive':'sum',
            'dur':s.revolution + 'ms',
            'repeatDur':'indefinite'
        });
        cont.appendChild(ani);

        for (var i = 0; i < $('lines').value; i++) {

            var use = document.createElement('use');
            attr(use, {
                'xlink:href':'#l',
                'transform':'rotate(' + (i * 30) + ')',
                'opacity':Math.round(1 / $('lines').value * i * 100) / 100
            });

            cont.appendChild(use);
        }

        var source = encodeURI('data:image/svg+xml,' + '<?xml version="1.0" encoding="utf-8"?>' + wrapper.innerHTML);

        //$('spinner').src = source;
        //$('spinner').width = $('outerRadius').value * 2;
        //$('spinner').height = $('outerRadius').value * 2;

        $('preview').innerHTML = wrapper.innerHTML;


        var code = '<img height="' + s.outerRadius + '" width="' + s.outerRadius + '" src="' + source + '"/>';
        $('output').innerHTML = code;
    }

    buildSpinner(spinner);


})(window, document)