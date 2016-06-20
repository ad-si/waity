/* globals shaven */

const spinnerProperties = {
  lines: 12,
  outerRadius: 40,
  innerRadius: 18,
  borderRadius: 1,
  width: 5,
  revolution: 1000,
  // shadow: 0,
  continuous: false,
  color: 'rgb(0,0,0)',
}

function getElById (id) {
  return document.getElementById(id)
}

function buildSpinner (config) {
  const preview = getElById('preview')

  preview.innerHTML = ''

  shaven.default([
    preview,
    ['svg#waity',
      {
        width: 2 * config.outerRadius,
        height: 2 * config.outerRadius,
        xmlns: 'http://www.w3.org/2000/svg',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
      },
      ['defs',
        ['rect#w', {
          x: config.innerRadius, // eslint-disable-line id-length
          y: -config.width / 2, // eslint-disable-line id-length
          rx: config.borderRadius,
          ry: config.borderRadius,
          width: Math.abs(config.outerRadius - config.innerRadius),
          height: config.width,
          fill: config.color},
        ],
      ],
      ['g#spinnerContainer',
        {
          transform: 'translate(' + (config.outerRadius) + ', ' +
            (config.outerRadius) + ')',
        },
        ['animateTransform#spinnerAnimation', {
          attributeName: 'transform',
          calcMode: config.continuous ?
            'linear' :
            'discrete',
          type: 'rotate',
          by: 360 / config.lines,
          accumulate: 'sum',
          dur: Math.round(config.revolution / config.lines) + 'ms',
          repeatCount: 'indefinite'},
        ],
      ],
    ],
  ])

  for (let index = 0; index < config.lines; index++) {
    const use = shaven.default({
      namespace: 'svg',
      elementArray: ['use', {
        transform: 'rotate(' + (index * 360 / config.lines) + ')',
        opacity: Math.round(100 / config.lines * (index + 1)) / 100},
      ],
    })[0]

    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#w')

    getElById('spinnerContainer')
      .appendChild(use)
  }


  getElById('output').textContent = preview
    .innerHTML
    .replace(
      new RegExp('xmlns:xlink=".{28}" xlink', 'gi'),
      'xlink'
    )
}


for (const prop in spinnerProperties) {
  if (!spinnerProperties.hasOwnProperty(prop)) continue

  if (prop !== 'continuous' && prop !== 'color') {
    const inputElement = getElById(prop)

    inputElement.value = String(spinnerProperties[prop])
    inputElement
      .previousElementSibling
      .previousElementSibling
      .textContent = String(inputElement.value)

    inputElement.addEventListener('change', event => {
      const element = event.currentTarget
      spinnerProperties[element.id] = String(element.value)
      buildSpinner(spinnerProperties)
      element
        .previousElementSibling
        .previousElementSibling
        .textContent = String(element.value)
    })
  }
}

buildSpinner(spinnerProperties)
