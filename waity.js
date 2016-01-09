!function (window, document, undefined) {

	function $(id) {
		return document.getElementById(id)
	}

	var spinnerProperties = {
			lines: 12,
			outerRadius: 40,
			innerRadius: 18,
			borderRadius: 1,
			width: 5,
			revolution: 1000,
			shadow: 0,
			continuous: false,
			color: 'rgb(0,0,0)',
		},
		prop

	function buildSpinner(s) {

		var preview = $('preview'),
			use,
			i

		preview.innerHTML = ''

		DOMinate(
			[preview,
				['svg#waity',
					{
						width: 2 * s.outerRadius,
						height: 2 * s.outerRadius,
						xmlns: 'http://www.w3.org/2000/svg',
						'xmlns:xlink': 'http://www.w3.org/1999/xlink',
					},
					['defs',
						['rect#w', {
							x: s.innerRadius,
							y: -s.width / 2,
							rx: s.borderRadius,
							ry: s.borderRadius,
							width: Math.abs(s.outerRadius - s.innerRadius),
							height: s.width,
							fill: s.color},
						]
					],
					['g#spinnerContainer',
						{
							transform: 'translate(' + (s.outerRadius) + ', ' +
								(s.outerRadius) + ')'
						},
						['animateTransform#spinnerAnimation', {
							attributeName: 'transform',
							calcMode: s.continuous ?
								'linear' :
								'discrete',
							type: 'rotate',
							by: 360 / s.lines,
							accumulate: 'sum',
							dur: Math.round(s.revolution / s.lines) + 'ms',
							repeatCount: 'indefinite'}
						]
					]
				]
			],
			'http://www.w3.org/2000/svg'
		)


		for (i = 0; i < s.lines; i++) {

			use = DOMinate(
				['use', {
					transform: 'rotate(' + (i * 360 / s.lines) + ')',
					opacity: Math.round(100 / s.lines * (i + 1)) / 100},
				],
				'http://www.w3.org/2000/svg'
			)[0]

			use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#w')

			$('spinnerContainer').appendChild(use)
		}


		$('output').textContent = preview
			.innerHTML
			.replace(
				new RegExp('xmlns:xlink=".{28}" xlink', 'gi'),
				'xlink'
			)
	}


	for (prop in spinnerProperties) {

		if (spinnerProperties.hasOwnProperty(prop)) {
			if (prop != 'continuous' && prop != 'color') {

				$(prop).value = spinnerProperties[prop]
				$(prop)
					.previousElementSibling
					.previousElementSibling
					.innerHTML = $(prop).value

				$(prop).addEventListener('change', function () {
					spinnerProperties[this.id] = Number(this.value)
					buildSpinner(spinnerProperties)
					this
						.previousElementSibling
						.previousElementSibling
						.innerHTML = this.value
				})
			}
		}
	}

	buildSpinner(spinnerProperties)

}(window, document)
