import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FullscreenControl, LngLat, Map, Marker } from 'mapbox-gl';
import { first } from 'rxjs/operators';

import { LocationService } from 'src/app/core/services/location.service';
import { environment } from 'src/environments/environment';

export type Side = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'

@Component({
    selector: 'app-location-picker',
    templateUrl: './location-picker.component.html',
    styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements AfterViewInit {
    isTextHidden = true
    side: Side = 'top-left'
    latitude = 0
    longitude = 0

    private map: Map
    private marker: Marker

    @Input()
    center = { lng: -44.2957, lat: -12.361645 }

    @Input()
    textSide: Side = 'top-left'

    @Output()
    onLocationChange = new EventEmitter<LngLat>()

    @Output()
    onMouseMove = new EventEmitter<LngLat>()

    constructor(private locationService: LocationService) { }

    ngAfterViewInit() {
        this.map = new Map({
            container: 'map-location-picker',
            style: 'mapbox://styles/mapbox/outdoors-v11',
            zoom: 6,
            accessToken: environment.mapKey
        })

        this.map.on('load', () => {
            this.setUpMap()
            this.handleEvents()
        })
    }

    private setUpMap() {
        const { lng, lat } = this.center

        this.map.getCanvas().style.cursor = 'crosshair'
        this.map.setCenter({ lng, lat })
        this.map.addControl(new FullscreenControl())
        this.marker = new Marker({ color: '#4287f5' })
    }

    private handleEvents() {
        this.map.on('mouseover', () =>
            this.isTextHidden = false
        )

        this.map.on('mousemove', event => {
            const { lng, lat } = event.lngLat

            this.longitude = lng
            this.latitude = lat
            this.onMouseMove.next(event.lngLat)
        })

        this.map.on('click', event => {
            this.marker.remove()
            this.marker.setLngLat(event.lngLat)
            this.marker.addTo(this.map)
            this.onLocationChange.next(event.lngLat)
        })

        this.locationService.currentLocation$
            .pipe(first())
            .subscribe(location => {
                const { latitude, longitude } = location.coords

                this.map.flyTo({
                    center: [longitude, latitude],
                    zoom: 13
                })
            })
    }
}
