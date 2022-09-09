import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FeatureCollection, Point } from 'geojson';
import { AnySourceData, EventData, GeoJSONSource, GeolocateControl, Map, MapMouseEvent, ScaleControl, NavigationControl } from 'mapbox-gl';
import { RulerControl } from 'mapbox-gl-controls';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthorizationService } from 'src/app/configurations/security/authorization.service';
import { City } from 'src/app/core/models/city.model';
import { Farm } from 'src/app/core/models/farm.model';
import { ProducerService } from 'src/app/core/services/producer.service';
import { formatNumber } from 'src/app/core/utils/format';
import { loadImage } from 'src/app/core/utils/map';
import { FileExportControl } from 'src/app/core/utils/map/file-export-control';
import { DPI, Format, MapboxExportControl, PageOrientation, Size } from 'src/app/core/utils/map/print';
import { MapboxStyleSwitcherControl } from 'src/app/core/utils/map/style-switcher';
import { ResolveOccurrenceDialogComponent } from 'src/app/pages/occurrences/components/resolve-occurrence-dialog/resolve-occurrence-dialog.component';
import { Occurrence } from 'src/app/pages/occurrences/models/occurrence.model';
import { OccurrenceService } from 'src/app/pages/occurrences/services/occurrence.service';
import { environment } from 'src/environments/environment';
import { Aquifer } from '../../models/aquifer.model';
import { ConservationUnit } from '../../models/conservation-unit';
import { Corridor } from '../../models/corridor.model';
import { GeoPark } from '../../models/geopark.model';
import { GeoSite } from '../../models/geosite.model';
import { IndigenousLand } from '../../models/indi-land.model';
import { IrrigatedArea } from '../../models/irrigated-area.model';
import { Ordinance } from '../../models/ordinance.model';
import { Pivot } from '../../models/pivot.model';
import { RainfallStation } from '../../models/rainfall-station.model';
import { Sicar, SicarFarm } from '../../models/sicar.model';
import { Visit } from '../../models/visit.model';
import { FireRiskService } from '../../services/fire-risk.service';
import { HydrographyService } from '../../services/hydrography.service';
import { IcmbioService } from '../../services/icmbio.service';
import { IrrigatedAreasService } from '../../services/irrigated-areas.service';
import { MapService } from '../../services/map.service';
import { OrdinanceService } from "../../services/ordinance.service";
import { RainfallService } from '../../services/rainfall.service';
import { SicarService } from '../../services/sicar.service';
import { VisitService } from '../../services/visit.service';
import { OccurrencePhotoDialogComponent } from '../occurrence-photo-dialog/occurrence-photo-dialog.component';
import { RainfallDialogComponent } from '../rainfall-dialog/rainfall-dialog.component';
import { VisitDialogComponent } from '../visit-dialog/visit-dialog.component';
import { OccurrencePopupFactory } from './popups/occurrence-popup-factory';
import { PopupConfig, PopupFactory, PopupLink } from './popups/popup-factory';

const RIVERS_SOURCE = 'source-rivers'
const RIVERS_LAYER = 'layer-rivers'
const RIVERS_TEXT_LAYER = 'layer-rivers-text'

const BASINS_SOURCE = 'source-basins'
const BASINS_LAYER = 'layer-basins'

const FLOW_RATES_SOURCE = 'source-flow-rates'
const FLOW_RATES_LAYER = 'layer-flow-rates'

const Q90_SOURCE = 'source-q90'
const Q90_LAYER = 'layer-q90'

const QMLD_SOURCE = 'source-qmld'
const QMLD_LAYER = 'layer-qmld'

const FARMS_SOURCE = 'source-farms'
const FARMS_LAYER = 'layer-farms'
const FARMS_BORDER_LAYER = 'layer-farms-borders'
const FARMS_TEXT_LAYER = 'layer-farms-text'

const ORDINANCE_SOURCE = 'source-ordinance'
const ORDINANCE_LAYER = 'layer-ordinance'
const ORDINANCE_ICON = 'icon-ordinance'

const RAINFALL_SOURCE = 'rainfall-source'
const RAINFALL_LAYER = 'rainfall-layer'
const RAINFALL_ICON = 'icon-rainfall'

const AQUIFER_SOURCE = 'source-aquifer'
const AQUIFER_LAYER = 'layer-aquifer'
const AQUIFER_BORDER_LAYER = 'layer-aquifer-border'

const FIRE_RISK_SOURCE = 'source-fire-risk'
const FIRE_RISK_LAYER = 'layer-fire-risk'
const FIRE_RISK_ICON = 'icon-fire-risk'

const IRRIGATED_AREAS_SOURCE = 'source-irrigated-areas'
const IRRIGATED_AREAS_LAYER = 'layer-irrigated-areas'
const IRRIGATED_AREAS_BORDER_LAYER = 'layer-irrigated-areas-border'

const OCCURRENCES_SOURCE = 'source-occurrences'
const OCCURRENCES_LAYER = 'layer-occurrences'
const OCCURRENCES_CLUSTER_LAYER = 'layer-occurrences-cluster'
const OCCURRENCES_COUNT_LAYER = 'layer-occurrences-count'
const OCCURRENCES_ICON = 'icon-occurrences'

const VISITS_SOURCE = 'source-visits'
const VISITS_LAYER = 'layer-visits'
const VISITS_ICON = 'icon-visits'

const PIVOTS_SOURCE = 'source-pivots'
const PIVOTS_LAYER = 'layer-pivots'
const PIVOTS_BORDER_LAYER = 'layer_pivots-border'

const CITY_SOURCE = 'source-city'
const CITY_LAYER = 'layer-city'
const CITY_BORDER_LAYER = 'layer-city-border'
const CITY_TEXT_LAYER = 'layer-city-text'

const SICAR_SOURCE = 'source-sicar'
const SICAR_LAYER = 'layer-sicar'
const SICAR_BORDER_LAYER = 'layer_sicar-border'

const SICAR_FARMS_SOURCE = 'source-sicar-farms'
const SICAR_FARMS_LAYER = 'layer-sicar-farms'
const SICAR_FARMS_BORDER_LAYER = 'layer_sicar-farms-border'

const INDI_SOURCE = 'source-indigenous'
const INDI_LAYER = 'layer-indigenous'
const INDI_BORDER_LAYER = 'layer_indigenous-border'

const GEO_SITE_SOURCE = 'source-geo-site'
const GEO_SITE_LAYER = 'layer-geo-site'

const CORRIDORS_SOURCE = 'source-corridors'
const CORRIDORS_LAYER = 'layer-corridors'
const CORRIDORS_BORDER_LAYER = 'layer_corridors-border'

const GEO_PARKS_SOURCE = 'source-geo-parks'
const GEO_PARKS_LAYER = 'layer-geo-parks'

const CONSERVATION_SOURCE = 'source-conservation'
const CONSERVATION_LAYER = 'layer-conservation'
const CONSERVATION_BORDER_LAYER = 'layer_conservation-border'

@UntilDestroy()
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: [
        './map.component.scss',
        './popups/popup.scss',
        './popups/occurrence-popup.scss'
    ]
})
export class MapComponent implements AfterViewInit {
    private map: Map
    private popupFactory: PopupFactory
    private occurrencePopupFactory: OccurrencePopupFactory
    private refresh$ = new Subject();

    constructor(
        sanitizer: DomSanitizer,
        authService: AuthorizationService,
        private dialog: MatDialog,
        private mapService: MapService,
        private hydroService: HydrographyService,
        private producerService: ProducerService,
        private ordinanceService: OrdinanceService,
        private rainfallService: RainfallService,
        private fireRiskService: FireRiskService,
        private irrigatedAreasService: IrrigatedAreasService,
        private occurrencesService: OccurrenceService,
        private visitService: VisitService,
        private sicarService: SicarService,
        private icmbioService: IcmbioService
    ) {
        this.popupFactory = new PopupFactory(sanitizer)
        this.occurrencePopupFactory = new OccurrencePopupFactory(sanitizer, authService)
    }

    ngAfterViewInit() {
        this.map = new Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/outdoors-v11',
            center: [-44.2957, -12.361645],
            zoom: 7,
            attributionControl: false,
            accessToken: environment.mapKey
        });

        this.map.on('load', this.setUpMap)
    }

    private setUpMap = async () => {
        await this.setUpIcons()
        this.setUpControls()
        this.setUpLayers()
        this.setUpDataSources()
        this.setUpEvents()
        this.refresh$.next()
    }

    private async setUpIcons() {
        const fireIcon = await loadImage(this.map, '/assets/icons/fire.png')
        this.map.addImage(FIRE_RISK_ICON, fireIcon)

        const ordinanceIcon = await loadImage(this.map, '/assets/icons/calendar.png')
        this.map.addImage(ORDINANCE_ICON, ordinanceIcon)

        const occurrencesIcon = await loadImage(this.map, '/assets/icons/alert.png')
        this.map.addImage(OCCURRENCES_ICON, occurrencesIcon)

        const visitsIcon = await loadImage(this.map, '/assets/icons/visita.png')
        this.map.addImage(VISITS_ICON, visitsIcon)

        const rainfallIcon = await loadImage(this.map, '/assets/icons/meteorologica.png')
        this.map.addImage(RAINFALL_ICON, rainfallIcon)
    }

    private setUpControls() {
        this.map.addControl(new NavigationControl());
        this.map.addControl(new RulerControl());
        this.map.addControl(new MapboxStyleSwitcherControl());
        this.map.addControl(new ScaleControl(), "bottom-right");
        this.map.addControl(new FileExportControl());
        this.map.addControl(new GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserHeading: true
        }));

        this.map.addControl(new MapboxExportControl({
            PageSize: Size.A4,
            PageOrientation: PageOrientation.Portrait,
            Format: Format.JPEG,
            DPI: DPI[96],
            Crosshair: true,
            accessToken: environment.mapKey
        }))
    }

    private setUpLayers() {
        const initialData: AnySourceData = {
            type: 'geojson',
            data: null
        }

        // Basins
        this.map.addSource(BASINS_SOURCE, initialData)
        this.map.addLayer({
            id: BASINS_LAYER,
            type: 'fill',
            source: BASINS_SOURCE,
            paint: {
                'fill-color': 'blue',
                'fill-opacity': 0.25,
            }
        })

        // Rivers
        this.map.addSource(RIVERS_SOURCE, initialData)
        this.map.addLayer({
            id: RIVERS_LAYER,
            type: 'line',
            source: RIVERS_SOURCE,
            paint: {
                'line-width': 3,
                'line-color': 'teal',
            }
        })

        this.map.addLayer({
            id: RIVERS_TEXT_LAYER,
            type: 'symbol',
            source: RIVERS_SOURCE,
            paint: {
                'text-color': 'teal'
            },
            layout: {
                'symbol-placement': 'line',
                'text-field': '{name_river}',
                'text-anchor': 'bottom',
                'text-size': 14,
                'text-letter-spacing': 0.2
            }
        })

        // Flow rates
        this.map.addSource(FLOW_RATES_SOURCE, initialData)
        this.map.addLayer({
            id: FLOW_RATES_LAYER,
            type: 'line',
            source: FLOW_RATES_SOURCE,
            paint: {
                'line-width': 1,
                'line-color': 'teal',
                'line-opacity': 0.33,
            }
        })

        this.map.addSource(Q90_SOURCE, initialData)
        this.map.addLayer({
            id: Q90_LAYER,
            type: 'line',
            source: Q90_SOURCE,
            paint: {
                'line-width': 2,
                'line-color': ['get', 'q90_color'],
            }
        })

        this.map.addSource(QMLD_SOURCE, initialData)
        this.map.addLayer({
            id: QMLD_LAYER,
            type: 'line',
            source: QMLD_SOURCE,
            paint: {
                'line-width': 2,
                'line-color': ['get', 'qmld_color'],
            }
        })

        // Aquifers
        this.map.addSource(AQUIFER_SOURCE, initialData)
        this.map.addLayer({
            id: AQUIFER_LAYER,
            type: 'fill',
            source: AQUIFER_SOURCE,
            paint: {
                'fill-color': '#003399',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    0.5,
                    0.0
                ]
            }
        })

        this.map.addLayer({
            'id': AQUIFER_BORDER_LAYER,
            'type': 'line',
            'source': AQUIFER_SOURCE,
            'paint': {
                'line-color': '#003399',
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    3,
                    2
                ]
            }
        })

        // Farms
        this.map.addSource(FARMS_SOURCE, initialData)
        this.map.addLayer({
            id: FARMS_LAYER,
            type: 'fill',
            source: FARMS_SOURCE,
            paint: {
                'fill-color': '#ff6666',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    0.5,
                    0.0
                ]
            }
        })

        this.map.addLayer({
            'id': FARMS_BORDER_LAYER,
            'type': 'line',
            'source': FARMS_SOURCE,
            'paint': {
                'line-color': '#ff6666',
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    2,
                    1
                ]
            }
        })

        this.map.addLayer({
            id: FARMS_TEXT_LAYER,
            type: 'symbol',
            source: FARMS_SOURCE,
            paint: {
                'text-color': '#ff6666',
            },
            layout: {
                'symbol-placement': 'point',
                'text-field': '{farm_name}',
                'text-anchor': 'center',
                'text-size': 10,
                'text-letter-spacing': 0.2
            }
        })

        // Ordinances
        this.map.addSource(ORDINANCE_SOURCE, initialData)
        this.map.addLayer({
            id: ORDINANCE_LAYER,
            type: 'symbol',
            source: ORDINANCE_SOURCE,
            layout: {
                'icon-image': ORDINANCE_ICON,
                'icon-size': 0.3
            }
        })

        // Rainfall
        this.map.addSource(RAINFALL_SOURCE, initialData)
        this.map.addLayer({
            id: RAINFALL_LAYER,
            type: 'symbol',
            source: RAINFALL_SOURCE,
            layout: {
                'icon-image': RAINFALL_ICON,
                'icon-size': 0.3
            }
        })

        // Fire risk
        this.map.addSource(FIRE_RISK_SOURCE, initialData)
        this.map.addLayer({
            id: FIRE_RISK_LAYER,
            type: 'symbol',
            source: FIRE_RISK_SOURCE,
            layout: {
                'icon-image': FIRE_RISK_ICON,
                'icon-size': 1.5
            }
        })

        // Irrigated areas
        this.map.addSource(IRRIGATED_AREAS_SOURCE, initialData)
        this.map.addLayer({
            'id': IRRIGATED_AREAS_LAYER,
            'type': 'fill',
            'source': IRRIGATED_AREAS_SOURCE,
            paint: {
                'fill-color': '#00ffff',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    0.5,
                    0.0
                ]
            }
        })

        this.map.addLayer({
            'id': IRRIGATED_AREAS_BORDER_LAYER,
            'type': 'line',
            'source': IRRIGATED_AREAS_SOURCE,
            'paint': {
                'line-color': '#00ffff',
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    2,
                    1
                ]
            }
        })

        // Occurrences
        this.map.addSource(OCCURRENCES_SOURCE, initialData)
        this.map.addLayer({
            id: OCCURRENCES_LAYER,
            type: 'symbol',
            source: OCCURRENCES_SOURCE,
            filter: ['!', ['has', 'point_count']],
            layout: {
                'icon-image': OCCURRENCES_ICON,
                'icon-size': 0.1
            }
            /*paint: {
                'circle-color': [
                    'case',
                    ['!=', ['get', 'resolved_date'], null],
                    '#458985',
                    ['==', ['get', 'occurrence_type'], 'FALLOW'],
                    '#f0b01d',
                    '#e23629'
                ],
                'circle-radius': 8,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }*/
        });

        this.map.addLayer({
            id: OCCURRENCES_CLUSTER_LAYER,
            type: 'symbol',
            source: OCCURRENCES_SOURCE,
            layout: {
                'icon-image': OCCURRENCES_ICON,
                'icon-size': 0.1
            }
        });

        this.map.addLayer({
            id: OCCURRENCES_COUNT_LAYER,
            type: 'symbol',
            source: OCCURRENCES_SOURCE,
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            },
            paint: { 'text-color': '#ffffff' }
        });

        // Visits
        this.map.addSource(VISITS_SOURCE, initialData)
        this.map.addLayer({
            id: VISITS_LAYER,
            type: 'symbol',
            source: VISITS_SOURCE,
            layout: {
                'icon-image': VISITS_ICON,
                'icon-size': 0.2,
            }
        })

        // Pivots
        this.map.addSource(PIVOTS_SOURCE, initialData)
        this.map.addLayer({
            'id': PIVOTS_LAYER,
            'type': 'fill',
            'source': PIVOTS_SOURCE,
            paint: {
                'fill-color': '#00ffff',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    0.5,
                    0.0
                ]
            }
        })

        this.map.addLayer({
            'id': PIVOTS_BORDER_LAYER,
            'type': 'line',
            'source': PIVOTS_SOURCE,
            'paint': {
                'line-color': '#00ffff',
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    2,
                    1
                ]
            }
        })

        // Cities
        this.map.addSource(CITY_SOURCE, initialData)
        this.map.addLayer({
            id: CITY_LAYER,
            type: 'fill',
            source: CITY_SOURCE,
            paint: {
                'fill-color': '#000',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    0.5,
                    0.0
                ]
            }
        })

        this.map.addLayer({
            'id': CITY_BORDER_LAYER,
            'type': 'line',
            'source': CITY_SOURCE,
            'paint': {
                'line-color': '#000',
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    3,
                    2
                ]
            }
        })

        this.map.addLayer({
            id: CITY_TEXT_LAYER,
            type: 'symbol',
            source: CITY_SOURCE,
            paint: {
                'text-color': '#000',
            },
            layout: {
                'symbol-placement': 'point',
                'text-field': '{name}',
                'text-anchor': 'center',
                'text-size': 10,
                'text-letter-spacing': 0.2
            }
        })

        // Sicar
        this.map.addSource(SICAR_SOURCE, initialData)
        this.map.addLayer({
            id: SICAR_LAYER,
            type: 'fill',
            source: SICAR_SOURCE,
            paint: {
                'fill-color': [
                    'case',
                    ['==', ['get', 'subject'], 'APP'],
                    '#33cc33',
                    ['==', ['get', 'subject'], 'AREA_CONSOLIDADA'],
                    '#663300',
                    ['==', ['get', 'subject'], 'RESERVA_LEGAL'],
                    '#00ff00',
                    ['==', ['get', 'subject'], 'VEGETACAO_NATIVA'],
                    '#006600',
                    '#000'
                ],
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    0.5,
                    0.0
                ]
            }
        })

        this.map.addLayer({
            'id': SICAR_BORDER_LAYER,
            'type': 'line',
            'source': SICAR_SOURCE,
            'paint': {
                'line-color': [
                    'case',
                    ['==', ['get', 'subject'], 'APP'],
                    '#33cc33',
                    ['==', ['get', 'subject'], 'AREA_CONSOLIDADA'],
                    '#663300',
                    ['==', ['get', 'subject'], 'RESERVA_LEGAL'],
                    '#00ff00',
                    ['==', ['get', 'subject'], 'VEGETACAO_NATIVA'],
                    '#006600',
                    '#000'
                ],
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    2,
                    1
                ]
            }
        })

        // Sicar farms
        this.map.addSource(SICAR_FARMS_SOURCE, initialData)
        this.map.addLayer({
            id: SICAR_FARMS_LAYER,
            type: 'fill',
            source: SICAR_FARMS_SOURCE,
            paint: {
                'fill-color': '#996600',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    0.5,
                    0.0
                ]
            }
        })

        this.map.addLayer({
            'id': SICAR_FARMS_BORDER_LAYER,
            'type': 'line',
            'source': SICAR_FARMS_SOURCE,
            'paint': {
                'line-color': '#996600',
                'line-dasharray': [1, 2],
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    2,
                    1
                ]
            }
        })

        // Indigenous Land
        this.map.addSource(INDI_SOURCE, initialData)
        this.map.addLayer({
            id: INDI_LAYER,
            type: 'fill',
            source: INDI_SOURCE,
            paint: {
                'fill-color': '#666633',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    0.5,
                    0.0
                ]
            }
        })

        this.map.addLayer({
            'id': INDI_BORDER_LAYER,
            'type': 'line',
            'source': INDI_SOURCE,
            'paint': {
                'line-color': '#666633',
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    3,
                    2
                ]
            }
        })

        // Geo Sites
        this.map.addSource(GEO_SITE_SOURCE, initialData)
        this.map.addLayer({
            id: GEO_SITE_LAYER,
            type: 'circle',
            source: GEO_SITE_SOURCE,
            paint: {
                'circle-color': '#cccc00',
                'circle-radius': 8,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        })

        // Geo corridors
        this.map.addSource(CORRIDORS_SOURCE, initialData)
        this.map.addLayer({
            id: CORRIDORS_LAYER,
            type: 'fill',
            source: CORRIDORS_SOURCE,
            paint: {
                'fill-color': '#cc3300',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    0.5,
                    0.0
                ]
            }
        })

        this.map.addLayer({
            'id': CORRIDORS_BORDER_LAYER,
            'type': 'line',
            'source': CORRIDORS_SOURCE,
            'paint': {
                'line-color': '#cc3300',
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    3,
                    2
                ]
            }
        })

        // Geo Parks
        this.map.addSource(GEO_PARKS_SOURCE, initialData)
        this.map.addLayer({
            id: GEO_PARKS_LAYER,
            type: 'circle',
            source: GEO_PARKS_SOURCE,
            paint: {
                'circle-color': '#00cc00',
                'circle-radius': 8,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        })

        // Conservation units
        this.map.addSource(CONSERVATION_SOURCE, initialData)
        this.map.addLayer({
            id: CONSERVATION_LAYER,
            type: 'fill',
            source: CONSERVATION_SOURCE,
            paint: {
                'fill-color': '#009999',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    0.5,
                    0.0
                ]
            }
        })

        this.map.addLayer({
            'id': CONSERVATION_BORDER_LAYER,
            'type': 'line',
            'source': CONSERVATION_SOURCE,
            'paint': {
                'line-color': '#009999',
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'click'], false],
                    3,
                    2
                ]
            }
        })
    }

    setUpDataSources() {
        this.bindSourceToData(BASINS_SOURCE, this.hydroService.limits$)
        this.bindSourceToData(RIVERS_SOURCE, this.hydroService.rivers$)
        this.bindSourceToData(FLOW_RATES_SOURCE, this.hydroService.flowRates$)
        this.bindSourceToData(Q90_SOURCE, this.hydroService.q90$)
        this.bindSourceToData(QMLD_SOURCE, this.hydroService.qmld$)
        this.bindSourceToData(FARMS_SOURCE, this.producerService.farmFeatures$)
        this.bindSourceToData(ORDINANCE_SOURCE, this.ordinanceService.ordinances$)
        this.bindSourceToData(RAINFALL_SOURCE, this.rainfallService.stations$)
        this.bindSourceToData(AQUIFER_SOURCE, this.hydroService.aquifers$)
        this.bindSourceToData(FIRE_RISK_SOURCE, this.fireRiskService.fireRisks$)
        this.bindSourceToData(IRRIGATED_AREAS_SOURCE, this.irrigatedAreasService.irrigatedAreas$)
        this.bindSourceToData(OCCURRENCES_SOURCE, this.occurrencesService.occurrences$)
        this.bindSourceToData(VISITS_SOURCE, this.visitService.visits$)
        this.bindSourceToData(PIVOTS_SOURCE, this.irrigatedAreasService.pivots$)
        this.bindSourceToData(CITY_SOURCE, this.producerService.cities$)
        this.bindSourceToData(SICAR_SOURCE, this.sicarService.areaFeatures$)
        this.bindSourceToData(SICAR_FARMS_SOURCE, this.sicarService.farmFeatures$)
        this.bindSourceToData(INDI_SOURCE, this.icmbioService.indiFeatures$)
        this.bindSourceToData(CORRIDORS_SOURCE, this.icmbioService.corridorsFeatures$)
        this.bindSourceToData(GEO_SITE_SOURCE, this.icmbioService.geoSiteFeatures$)
        this.bindSourceToData(GEO_PARKS_SOURCE, this.icmbioService.geoParksFeatures$)
        this.bindSourceToData(CONSERVATION_SOURCE, this.icmbioService.conservationFeatures$)
    }

    setUpEvents() {
        this.mapService.zoomIn$
            .pipe(untilDestroyed(this))
            .subscribe(zoom => {
                this.map?.flyTo({
                    center: [zoom.latitude, zoom.longitude],
                    zoom: zoom.zoom,
                    duration: zoom.duration
                })
            })

        this.map.on('style.load', this.refreshLayers)

        this.setUpClickEffect(FARMS_SOURCE, FARMS_LAYER)
        this.addClickListener<Farm>(
            FARMS_SOURCE,
            FARMS_LAYER,
            this.farmConfig
        )

        this.setUpClickEffect(AQUIFER_SOURCE, AQUIFER_LAYER)
        this.addClickListener<Aquifer>(
            AQUIFER_SOURCE,
            AQUIFER_LAYER,
            this.aquiferConfig
        )

        this.setUpClickEffect(ORDINANCE_SOURCE, ORDINANCE_LAYER)
        this.addClickListener<Ordinance>(
            ORDINANCE_SOURCE,
            ORDINANCE_LAYER,
            this.ordinanceConfig
        )

        this.setUpClickEffect(IRRIGATED_AREAS_SOURCE, IRRIGATED_AREAS_LAYER)
        this.addClickListener<IrrigatedArea>(
            IRRIGATED_AREAS_SOURCE,
            IRRIGATED_AREAS_LAYER,
            this.irrigatedAreaConfig
        )

        this.setUpClickEffect(PIVOTS_SOURCE, PIVOTS_LAYER)
        this.addClickListener<Pivot>(
            PIVOTS_SOURCE,
            PIVOTS_LAYER,
            this.pivotConfig
        )

        this.addClickListener<RainfallStation>(
            RAINFALL_SOURCE,
            RAINFALL_LAYER,
            this.rainfallStationConfig
        )

        this.addClickListener<Visit>(
            VISITS_SOURCE,
            VISITS_LAYER,
            this.visitConfig
        )

        this.setUpClickEffect(CITY_SOURCE, CITY_LAYER)
        this.addClickListener<City>(
            CITY_SOURCE,
            CITY_LAYER,
            this.cityConfig
        )

        this.setUpClickEffect(SICAR_SOURCE, SICAR_LAYER)
        this.addClickListener<Sicar>(
            SICAR_SOURCE,
            SICAR_LAYER,
            this.sicarAreaConfig
        )

        this.setUpClickEffect(SICAR_FARMS_SOURCE, SICAR_FARMS_LAYER)
        this.addClickListener<SicarFarm>(
            SICAR_FARMS_SOURCE,
            SICAR_FARMS_LAYER,
            this.sicarFarmConfig
        )

        this.setUpClickEffect(CONSERVATION_SOURCE, CONSERVATION_LAYER)
        this.addClickListener<ConservationUnit>(
            CONSERVATION_SOURCE,
            CONSERVATION_LAYER,
            this.conservationConfig
        )

        this.setUpClickEffect(INDI_SOURCE, INDI_LAYER)
        this.addClickListener<IndigenousLand>(
            INDI_SOURCE,
            INDI_LAYER,
            this.indiConfig
        )

        this.setUpClickEffect(CORRIDORS_SOURCE, CORRIDORS_LAYER)
        this.addClickListener<Corridor>(
            CORRIDORS_SOURCE,
            CORRIDORS_LAYER,
            this.corridorsConfig
        )

        this.addClickListener<GeoSite>(
            GEO_SITE_SOURCE,
            GEO_SITE_LAYER,
            this.geoSitesConfig
        )

        this.addClickListener<GeoPark>(
            GEO_PARKS_SOURCE,
            GEO_PARKS_LAYER,
            this.geoParksConfig
        )

        this.showPointerOnMouseHover(OCCURRENCES_LAYER)
        this.setUpClusterClick(OCCURRENCES_CLUSTER_LAYER, OCCURRENCES_SOURCE)
        this.map.on('click', OCCURRENCES_LAYER, this.openOccurrencePopup)
        this.occurrencePopupFactory
            .onPhotoClick(this.openOccurrencePhotoDialog)
            .onDetailsClick(this.openOccurrenceDetailsDialog)
            .onResolveClick(this.openResolveOccurrenceDialog)
    }

    private bindSourceToData(source: string, observableData$: Observable<FeatureCollection>) {
        this.refresh$
            .pipe(
                untilDestroyed(this),
                switchMap(() => observableData$)
            )
            .subscribe(data => {
                const geoJsonSource = this.map.getSource(source) as GeoJSONSource
                geoJsonSource.setData(data)
            })
    }

    private openRainfallStationDialog = (station: RainfallStation) => {
        this.dialog.open(RainfallDialogComponent, {
            data: station,
            width: '100%',
            panelClass: 'rounded-dialog'
        })
    }

    private openOccurrencePopup = (event: EventData) => {
        if (event.cancel) return
        
        event.cancel = true
        const feature = event.features[0]
        const occurrence: Occurrence = { ...feature.properties, position: feature.geometry }

        this.occurrencePopupFactory
            .create(occurrence)
            .addTo(this.map)
    }

    private openOccurrencePhotoDialog = (photoUrl: string) => {
        this.dialog.open(OccurrencePhotoDialogComponent, {
            maxWidth: '90vw',
            maxHeight: '90vh',
            panelClass: 'image-dialog',
            data: photoUrl
        })
    }

    private openResolveOccurrenceDialog = (occurrenceId: string) => {
        const config = {
            data: { id: occurrenceId },
            panelClass: 'full-bleed-dialog'
        }

        this.dialog.open(ResolveOccurrenceDialogComponent, config)
    }

    private openOccurrenceDetailsDialog = (report: Occurrence) => {
        // TODO
    }

    private openVisitDetailsDialog = (visit: Visit) => {
        this.dialog.open(VisitDialogComponent, {
            data: visit,
            panelClass: 'full-bleed-dialog',
            minWidth: '300px'
        })
    }

    private addClickListener<T = any>(
        source: string,
        layer: string,
        transformFn?: (data: T, geometry: any) => PopupConfig
    ) {
        this.showPointerOnMouseHover(layer)
        this.map.on('click', layer, (event: EventData) => {
            if (event.cancel) return

            event.cancel = true
            const { lat, lng } = event.lngLat
            const feature = event.features[0]
            const data = feature.properties
            const config = transformFn?.(data, feature.geometry) ?? { grid: data }

            this.popupFactory
                .create(lat, lng, config)
                .addTo(this.map)
                .on('close', () =>
                    this.map.setFeatureState(
                        { id: feature.id, source },
                        { click: false }
                    )
                )
        })
    }

    private showPointerOnMouseHover(layer: string) {
        const canvasStyle = this.map.getCanvas().style
        this.map.on('mouseenter', layer, () => canvasStyle.cursor = 'pointer')
        this.map.on('mouseleave', layer, () => canvasStyle.cursor = '')
    }

    private setUpClickEffect(source: string, layer: string) {
        let clickedStateId = null

        this.map.on('click', layer, event => {
            if (event.cancel || event.features.length === 0) {
                return
            }

            if (clickedStateId !== null) {
                this.map.setFeatureState(
                    { id: clickedStateId, source },
                    { click: false }
                )
            }

            clickedStateId = event.features[0].id

            this.map.setFeatureState(
                { id: clickedStateId, source },
                { click: true }
            )
        })
    }

    private setUpClusterClick(source: string, layer: string) {
        this.map.on('click', layer, (event: MapMouseEvent) => {
            const features = this.map.queryRenderedFeatures(event.point, { layers: [layer] });
            const clusterId = features[0].properties.cluster_id;
            const clusterSource = this.map.getSource(source) as GeoJSONSource

            clusterSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) return

                const point = features[0].geometry as Point
                const center = point.coordinates as [number, number]

                this.map.easeTo({ center, zoom })
            })
        })
    }

    private cityConfig = (city: City): PopupConfig => {
        const link = `http://www.geonames.org/search.html?q=${city.geoid}`
        return {
            title: city.name,
            grid: {
                'UF': city.state,
                'Link': new PopupLink(link, 'GeoNames.org')
            }
        }
    }

    private farmConfig = (farm: Farm): PopupConfig => {
        return {
            title: farm.farm_name,
            grid: {
                'Código': farm.farm_code,
                'Tipo': farm.property_type,
                'UF': farm.state,
                'Município': farm.city,
                'Área': formatNumber(farm.area,) + 'Km²'
            }
        }
    }

    private aquiferConfig = (aquifer: Aquifer): PopupConfig => {
        return {
            title: aquifer.name,
            grid: {
                'Tipo': aquifer.type,
                'Área': formatNumber(aquifer.area) + 'Km²',
                'Perímetro': formatNumber(aquifer.length) + 'Km'
            }
        }
    }

    private ordinanceConfig = (ordinance: Ordinance): PopupConfig => {
        return {
            title: ordinance.title,
            grid: {
                'Nº': ordinance.ordinance_number,
                'Processo': ordinance.process,
                'Publicação': ordinance.publish_date,
                'Emissor': ordinance.issuer_name,
                'CPF/CNPJ': ordinance.owner_doc,
                'Nome': ordinance.owner_name,
                'Prazo': ordinance.term ?? '-',
                'Link': ordinance.link ? new PopupLink(ordinance.link) : '-'
            }
        }
    }

    private irrigatedAreaConfig = (irrigatedArea: IrrigatedArea): PopupConfig => {
        return {
            grid: {
                'Área': formatNumber(irrigatedArea.area) + 'Km²',
                'Perímetro': formatNumber(irrigatedArea.length) + 'Km'
            }
        }
    }

    private pivotConfig = (pivot: Pivot): PopupConfig => {
        return {
            grid: {
                'Área': formatNumber(pivot.area) + 'Km²'
            }
        }
    }

    private rainfallStationConfig = (station: RainfallStation, geometry: any): PopupConfig => {
        return {
            title: station.city,
            grid: {
                'Código': station.code,
                'UF': station.state,
                'Altitude': formatNumber(station.altitude) + 'm'
            },
            action: {
                text: 'Dados observados',
                actionFn: () => this.openRainfallStationDialog({ ...station, geometry })
            }
        }
    }

    private visitConfig = (visit: Visit, geometry: any): PopupConfig => {
        return {
            title: visit.name,
            grid: {
                'Endereço': visit.address ?? '-',
                'Município': visit.city,
                'Nome': visit.owner || '-'
            },
            action: {
                text: 'Mais detalhes',
                actionFn: () => this.openVisitDetailsDialog({ ...visit, geometry })
            }
        }
    }

    private sicarAreaConfig = (area: Sicar): PopupConfig => {
        return {
            title: area.description,
            grid: {
                'Município': area.city_name,
                'Área': formatNumber(area.area_number, 2) + 'ha'
            }
        }
    }

    private sicarFarmConfig = (farm: SicarFarm): PopupConfig => {
        return {
            maxWidth: 400,
            title: 'Propriedadde (SICAR)',
            grid: {
                'Município': farm.city_name,
                'UF': farm.state,
                'Tipo': farm.property_type,
                'Situação': farm.status,
                'Condição': farm.condition
            }
        }
    }

    private indiConfig = (indi: IndigenousLand): PopupConfig => {
        return {
            title: indi.area_name,
            grid: {
                'Local': indi.location,
                'Cidade': indi.city,
                'Estado': indi.state,
                'População': indi.population,
                'Grupos': indi.groups,
                'Estágio': indi.stage,
                'Status': indi.status,
                'Criação': new Date(indi.date).toLocaleDateString(),
                'Extensão': indi.extension
            }
        }
    }

    private corridorsConfig = (corridor: Corridor): PopupConfig => {
        return {
            title: corridor.name,
            grid: {}
        }
    }

    private geoParksConfig = (geopark: GeoPark): PopupConfig => {
        return {
            maxWidth: 300,
            title: geopark.name,
            grid: {
                'UF': geopark.state,
                'Descrição': geopark.description
            }
        }
    }

    private geoSitesConfig = (geoSite: GeoSite): PopupConfig => {
        return {
            maxWidth: 300,
            title: geoSite.name,
            grid: {
                'UF': geoSite.state,
                'Tipo': geoSite.type,
                'Descrição': geoSite.description
            }
        }
    }

    private conservationConfig = (conservation: ConservationUnit): PopupConfig => {
        return {
            maxWidth: 400,
            title: conservation.name,
            grid: {
                'Categoria': conservation.category,
                'Grupo': conservation.group,
                'Domínio': conservation.sphere,
                'Criação': conservation.creation_year,
                'Qualidade': conservation.quality,
                'Ato Legal': conservation.legal_act,
                'Nome original': conservation.original_name
            }
        }
    }

    private refreshLayers = () => {
        this.setUpLayers()
        this.refresh$.next()
    }

}
