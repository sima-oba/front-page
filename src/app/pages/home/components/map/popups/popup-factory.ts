import { SecurityContext } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Popup } from "mapbox-gl";

import { formatNumber } from "src/app/core/utils/format";

export class PopupLink {
    constructor(public url: string, public text?: string) { }
}

export class PopupAction {
    constructor(public text: string, public actionFn: () => any) { }
}

export type PopupValue = string | number | PopupLink

export interface PopupGrid {
    [label: string]: PopupValue
}

export interface PopupConfig {
    title?: string,
    grid: PopupGrid,
    className?: string,
    showLatLng?: boolean,
    action?: PopupAction,
    minWidth?: number,
    maxWidth?: number
}

export class PopupFactory {
    private static readonly DEFAULT: PopupConfig = {
        title: null,
        grid: {},
        className: 'map-popup',
        showLatLng: true,
        minWidth: 200,
        maxWidth: 600
    }

    constructor(private sanitizer: DomSanitizer) { }

    create(lat: number, lng: number, config: PopupConfig): Popup {
        const {
            title,
            grid,
            className,
            showLatLng,
            action,
            minWidth,
            maxWidth
        } = { ...PopupFactory.DEFAULT, ...config }

        const heading = this.createHeading(title)
        const gridRows = this.createGridRows(grid)
        const latLngRow = showLatLng ? this.createLatLngRows(lat, lng) : ''
        const container = document.createElement('div')

        container.style.minWidth = minWidth + 'px'
        container.style.maxWidth = maxWidth + 'px'
        container.style.display = 'block'
        container.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, `
            ${heading}
            
            <div class="popup-grid mt-3">
                ${latLngRow}
                ${gridRows}
            </div>
        `)
        
        if (action) {
            container.appendChild(this.createAction(action))
        }

        return new Popup({ className })
            .setLngLat({ lat, lng })
            .setDOMContent(container)
    }

    private createHeading(title?: string): string {
        return title ? `<h3 class="popup-title my-0">${title}</h3>` : ''
    }

    private createGridRows(grid: PopupGrid): string {
        return Object.entries(grid)
            .map(([label, value]) => this.createRow(label, value))
            .join('\n')
    }

    private createLatLngRows(lat: number, lng: number): string {
        return `
            ${this.createRow('Latitude', formatNumber(lat))}
            ${this.createRow('Longitude', formatNumber(lng))}
        `
    }

    private createRow(label: string, value: PopupValue): string {
        let labelSpan = `<span class="popup-label">${label}</span>`
        let valueSpan: string

        if (value instanceof PopupLink) {
            valueSpan = `
                <span class="popup-value">
                    <a target="_blank" href="${value.url}">${value.text ?? value.url}</a>
                </span>
            `
        } else {
            valueSpan = `<span class="popup-value">${value}</span>`
        }

        return `${labelSpan} ${valueSpan}`
    }

    private createAction(action: PopupAction): HTMLElement {
        const container = document.createElement('div')
        const button = document.createElement('button')
        
        button.classList.add('popup-action')
        button.innerText = action.text
        container.appendChild(button)

        container.querySelector('.popup-action')
            .addEventListener('click', () => action.actionFn())

        return container
    }
}
