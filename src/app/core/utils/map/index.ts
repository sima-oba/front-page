import { FeatureCollection } from "geojson";
import { Map } from "mapbox-gl";

export function loadImage(map: Map, url: string): Promise<HTMLImageElement | ImageBitmap> {
    return new Promise((accept, reject) => {
        map.loadImage(url, (error, image) => {
            if (error) {
                reject(error)
            } else {
                accept(image)
            }
        })
    })
}

export function emptyFeatures(): FeatureCollection {
    return {
        type: 'FeatureCollection',
        features: []
    }
}
