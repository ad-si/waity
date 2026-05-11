// @ts-expect-error - Shaven library doesn't provide type definitions
import shaven from "shaven/source/library/browser.js"
import "./style.css"

interface SpinnerConfig {
  lines: number
  outerRadius: number
  innerRadius: number
  borderRadius: number
  width: number
  revolution: number
  continuous: boolean
  color: string
  setSize: boolean
}

const spinnerProperties: SpinnerConfig = {
  lines: 12,
  outerRadius: 40,
  innerRadius: 18,
  borderRadius: 1,
  width: 5,
  revolution: 1000,
  continuous: false,
  color: "rgb(0,0,0)",
  setSize: true,
}

function getElById (id: string): HTMLElement {
  const element = document.getElementById(id)
  if (!element) {
    throw new Error(`Element with id "${id}" not found`)
  }
  return element
}

function buildSpinner (config: SpinnerConfig): void {
  const preview = getElById("preview")

  preview.innerHTML = ""

  const size = 2 * config.outerRadius
  const svgAttributes: Record<string, string | number> = {
    viewBox: `0 0 ${size} ${size}`,
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
  }
  if (config.setSize) {
    svgAttributes.width = size
    svgAttributes.height = size
  }

  shaven([
    preview,
    ["svg.waity-spinner",
      svgAttributes,
      ["defs",
        ["rect#w", {
          // eslint-disable-next-line id-length
          x: config.innerRadius,
          // eslint-disable-next-line id-length
          y: -config.width / 2,
          rx: config.borderRadius,
          ry: config.borderRadius,
          width: Math.abs(config.outerRadius - config.innerRadius),
          height: config.width,
          fill: config.color},
        ],
      ],
      ["g#spinnerContainer",
        {
          transform: "translate(" + config.outerRadius + ", " +
            config.outerRadius + ")",
        },
        ["animateTransform#spinnerAnimation", {
          attributeName: "transform",
          calcMode: config.continuous
            ? "linear"
            : "discrete",
          type: "rotate",
          by: 360 / config.lines,
          accumulate: "sum",
          dur: Math.round(config.revolution / config.lines) + "ms",
          repeatCount: "indefinite"},
        ],
      ],
    ],
  ])

  for (let index = 0; index < config.lines; index++) {
    const use = shaven({
      namespace: "svg",
      elementArray: ["use", {
        transform: "rotate(" + (index * 360 / config.lines) + ")",
        opacity: Math.round(100 / config.lines * (index + 1)) / 100},
      ],
    })[0]

    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#w")

    getElById("spinnerContainer")
      .appendChild(use)
  }


  const output = getElById("output") as HTMLTextAreaElement
  const svgMarkup = preview
    .innerHTML
    .replace(
      new RegExp('xmlns:xlink=".{28}" xlink', "gi"),
      "xlink",
    )
  const formatInput = document.querySelector<HTMLInputElement>(
    "input[name=\"outputFormat\"]:checked",
  )
  const format = formatInput?.value ?? "svg"
  output.textContent = format === "base64"
    ? "data:image/svg+xml;base64," + btoa(svgMarkup)
    : svgMarkup

  // Auto-resize textarea to fit content
  output.style.height = "auto"
  output.style.height = output.scrollHeight + "px"
}


interface InputBinding {
  inputId: string
  configKey: keyof SpinnerConfig
  // Multiplier from config value to GUI display value.
  // Diameter sliders use 2 so users see diameter while config stores radius.
  displayFactor: number
}

const inputBindings: InputBinding[] = [
  {inputId: "lines", configKey: "lines", displayFactor: 1},
  {inputId: "outerDiameter", configKey: "outerRadius", displayFactor: 2},
  {inputId: "innerDiameter", configKey: "innerRadius", displayFactor: 2},
  {inputId: "borderRadius", configKey: "borderRadius", displayFactor: 1},
  {inputId: "width", configKey: "width", displayFactor: 1},
  {inputId: "revolution", configKey: "revolution", displayFactor: 1},
]

for (const binding of inputBindings) {
  const inputElement = getElById(binding.inputId) as HTMLInputElement
  const configValue = spinnerProperties[binding.configKey] as number
  const displayValue = configValue * binding.displayFactor
  inputElement.value = String(displayValue)
  const prevSibling = inputElement.previousElementSibling
  if (prevSibling?.previousElementSibling) {
    const valueDisplay = prevSibling.previousElementSibling
    valueDisplay.textContent = String(displayValue)
  }

  inputElement.addEventListener("input", event => {
    const element = event.currentTarget as HTMLInputElement
    const newDisplayValue = Number(element.value)
    type ConfigRecord = Record<string, number | string | boolean>
    ;(spinnerProperties as ConfigRecord)[binding.configKey] =
      newDisplayValue / binding.displayFactor

    buildSpinner(spinnerProperties)
    const elementPrevSibling = element.previousElementSibling
    if (elementPrevSibling?.previousElementSibling) {
      const elementValueDisplay = elementPrevSibling.previousElementSibling
      elementValueDisplay.textContent = String(element.value)
    }
  })
}

const setSizeInput = getElById("setSize") as HTMLInputElement
setSizeInput.checked = spinnerProperties.setSize
setSizeInput.addEventListener("change", () => {
  spinnerProperties.setSize = setSizeInput.checked
  buildSpinner(spinnerProperties)
})

buildSpinner(spinnerProperties)

document
  .querySelectorAll<HTMLInputElement>("input[name=\"outputFormat\"]")
  .forEach(input => {
    input.addEventListener("change", () => {
      buildSpinner(spinnerProperties)
    })
  })

// Copy button functionality
const copyButton = getElById("copyButton") as HTMLButtonElement
copyButton.addEventListener("click", async () => {
  const output = getElById("output") as HTMLTextAreaElement

  try {
    await navigator.clipboard.writeText(output.value)

    // Visual feedback
    copyButton.textContent = "Copied!"
    copyButton.classList.add("copied")

    setTimeout(() => {
      copyButton.textContent = "Copy Code"
      copyButton.classList.remove("copied")
    }, 2000)
  }
  catch {
    // Fallback for older browsers
    output.select()
    document.execCommand("copy")

    copyButton.textContent = "Copied!"
    copyButton.classList.add("copied")

    setTimeout(() => {
      copyButton.textContent = "Copy Code"
      copyButton.classList.remove("copied")
    }, 2000)
  }
})
