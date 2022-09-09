import { SecurityContext } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Popup } from "mapbox-gl";
import { AuthorizationService, Role } from "src/app/configurations/security/authorization.service";

import { Occurrence } from "src/app/pages/occurrences/models/occurrence.model";

export type OnPhotoClickListener = (photoUrl: string) => void
export type OnResolveClickListener = (id: string) => void
export type OnDetailsClickListener = (report: Occurrence) => void

export class OccurrencePopupFactory {
    private _onPhotoClick?: OnPhotoClickListener
    private _onResolveClick?: OnResolveClickListener
    private _onDetailsClick?: OnDetailsClickListener

    constructor(
        private sanitizer: DomSanitizer,
        private authService: AuthorizationService
    ) { }

    onPhotoClick(listener: OnPhotoClickListener): this {
        this._onPhotoClick = listener
        return this
    }

    onResolveClick(listener: OnResolveClickListener): this {
        this._onResolveClick = listener
        return this
    }

    onDetailsClick(listener: OnDetailsClickListener): this {
        this._onDetailsClick = listener
        return this
    }

    create(occurrence: Occurrence): Popup {
        const [lng, lat] = occurrence.position.coordinates
        const date = new Date(occurrence.occurrence_date).toLocaleDateString()
        const title = occurrence.occurrence_type == 'FALLOW'
            ? 'Incidência de Tiguera'
            : 'Incidência de Ferrugem'

        const container = document.createElement('div')
        const hidden = this.authService.hasRole(Role.MANAGE_OCCURRENCES) ? '' : 'hidden'

        container.style.display = 'block'
        container.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, `
            <h3 class="my-0">${title}</h3>

            <span>
                Data: <strong>${date}</strong>
            </span>

            <span>
                Lat: <strong>${lat.toFixed(3)}</strong>&nbsp;&nbsp;&nbsp;
                Lon: <strong>${lng.toFixed(3)}</strong>
            </span>

            <img class="occurrence-photo mt-2"
                src="${occurrence.occurrence_photo_href}"
                alt="Foto da ocorrência">

            <a class="resolve-button mt-2 mb-2 ${hidden}" href="">
                Resolver Ocorrência
            </a>

            <div class="resolved-footer">
                <span>Resolvido</span>
                <a href="#" class="details-button link">Observações</a>
            </div>
        `)

        container.querySelector('.occurrence-photo')
            .addEventListener('click', () =>
                this._onPhotoClick?.(occurrence.occurrence_photo_href)
            )

        container.querySelector('.resolve-button')
            .addEventListener('click', event => {
                event.preventDefault()
                popup.remove()
                this._onResolveClick?.(occurrence._id)
            })

        container.querySelector('.details-button')
            .addEventListener('click', event => {
                event.preventDefault()
                this._onDetailsClick?.(occurrence)
            })

        const className = occurrence.resolved_date == 'null'
            ? 'occurrence-popup-' + occurrence.occurrence_type.toLowerCase()
            : 'occurrence-popup-resolved'
            
        const popup = new Popup({ className })
            .setLngLat({ lat, lng })
            .setDOMContent(container)
            .setMaxWidth('none')

        return popup
    }
}
