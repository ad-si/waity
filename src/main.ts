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

  shaven([
    preview,
    ["svg.waity-spinner",
      {
        width: 2 * config.outerRadius,
        height: 2 * config.outerRadius,
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
      },
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
  output.textContent = preview
    .innerHTML
    .replace(
      new RegExp('xmlns:xlink=".{28}" xlink', "gi"),
      "xlink",
    )

  // Auto-resize textarea to fit content
  output.style.height = "auto"
  output.style.height = output.scrollHeight + "px"
}


for (const prop in spinnerProperties) {
  if (!Object.prototype.hasOwnProperty.call(spinnerProperties, prop)) continue

  if (prop !== "continuous" && prop !== "color") {
    const inputElement = getElById(prop) as HTMLInputElement

    const propValue = spinnerProperties[prop as keyof SpinnerConfig]
    inputElement.value = String(propValue)
    const prevSibling = inputElement.previousElementSibling
    if (prevSibling?.previousElementSibling) {
      const valueDisplay = prevSibling.previousElementSibling
      valueDisplay.textContent = String(inputElement.value)
    }

    inputElement.addEventListener("input", event => {
      const element = event.currentTarget as HTMLInputElement
      const key = element.id as keyof SpinnerConfig
      const value = element.value

      // Type-safe assignment based on property type
      type ConfigRecord = Record<string, number | string | boolean>
      if (typeof spinnerProperties[key] === "number") {
        (spinnerProperties as ConfigRecord)[key] = Number(value)
      }
      else {
        (spinnerProperties as ConfigRecord)[key] = value
      }

      buildSpinner(spinnerProperties)
      const elementPrevSibling = element.previousElementSibling
      if (elementPrevSibling?.previousElementSibling) {
        const elementValueDisplay = elementPrevSibling.previousElementSibling
        elementValueDisplay.textContent = String(element.value)
      }
    })
  }
}

buildSpinner(spinnerProperties)

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
  catch (error) {
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
