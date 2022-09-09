import { IControl, Map, AnySourceData } from "mapbox-gl";
import * as JSZip from "jszip";

import formats from './formats'

type ExportFormat = keyof typeof formats

const BUILT_IN_MAP_SOURCES = [
    'composite',
    'mapbox-gl-draw-cold',
    'mapbox-gl-draw-hot'
]

export class FileExportControl implements IControl {
    private map?: Map
    private formats = formats
    private container?: HTMLElement
    private select?: HTMLSelectElement

    constructor(private defaultFormat: ExportFormat = 'TXT') { }

    onAdd(map: Map): HTMLElement {
        this.map = map

        const formatKeys = Object.keys(this.formats)
        this.select = this.makeSelect(formatKeys)
        this.select.value = this.defaultFormat

        const table = this.makeTable({ 'Format': this.select })
        const exportButton = this.makeExportButton()
        this.container = this.makeContainer(table, exportButton)

        return this.container
    }

    onRemove(_map: Map) {
        this.container.remove()
        this.map = null
    }

    private makeContainer(...contents: HTMLElement[]): HTMLElement {
        const contentDiv = document.createElement('div')
        contentDiv.append(...contents)
        contentDiv.style.display = 'none'

        const activationButton = document.createElement('button')
        activationButton.type = 'button'
        activationButton.style.backgroundImage = 'url(assets/icons/download.svg)'
        activationButton.style.backgroundSize = '100% 100%'

        // Show contents when user clicks on activation button
        activationButton.addEventListener('click', () => {
            activationButton.style.display = 'none'
            contentDiv.style.display = 'block'
        })

        const container = document.createElement('div')
        container.classList.add('mapboxgl-ctrl')
        container.classList.add('mapboxgl-ctrl-group')
        container.append(activationButton, contentDiv)

        // Hide contents whenever the user clicks outside this container
        document.addEventListener('click', event => {
            if (!container.contains(event.target as HTMLElement)) {
                contentDiv.style.display = 'none'
                activationButton.style.display = 'block'
            }
        })

        return container
    }

    private makeSelect(values: string[]): HTMLSelectElement {
        const options = values.map(value => {
            const option = document.createElement('option')
            option.value = value
            option.textContent = value

            return option
        })

        const select = document.createElement('select')
        select.append(...options)

        return select
    }

    private makeTable(content: { [key: string]: HTMLElement }): HTMLTableElement {
        const rows = Object.entries(content).map(([key, element]) => {
            const tableRow = document.createElement('tr')
            const tableHeader = document.createElement('th')
            const tableData = document.createElement('td')

            tableHeader.textContent = key
            tableData.appendChild(element)
            tableRow.append(tableHeader, tableData)

            return tableRow
        })

        const tableBody = document.createElement('tbody')
        tableBody.append(...rows)

        const table = document.createElement('table')
        table.appendChild(tableBody)

        return table
    }

    private makeExportButton(): HTMLButtonElement {
        const button = document.createElement('button')
        button.type = 'button'
        button.textContent = 'Export'
        button.style.width = '100%'
        button.addEventListener('click', () => this.export())

        return button
    }

    private async export() {
        const zip = JSZip()
        const format = this.formats[this.select!.value]
        const sources = Object
            .entries(this!.map!.getStyle()!.sources)
            .filter(src => this.onlyUserSelectedSources(src))

        for (let [srcName, srcData] of sources) {
            const blob = await format.export((srcData as any).data)
            const filename = srcName + format.extension
            zip.file(filename, blob)
        }

        const zipFile = await zip.generateAsync({ type: 'blob' })
        const zipName = 'sima-layers.zip'

        this.download(zipName, zipFile)
    }

    private onlyUserSelectedSources(source: [string, AnySourceData]): boolean {
        const notBuiltIn = !BUILT_IN_MAP_SOURCES.includes(source[0])
        const notEmpty = (source[1] as any)?.data?.features?.length > 0

        return notBuiltIn && notEmpty
    }

    private download(filename: string, file: Blob) {
        const anchor = document.createElement('a')
        anchor.href = URL.createObjectURL(file)
        anchor.download = filename
        anchor.click()
    }
}
