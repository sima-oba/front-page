import { FeatureCollection } from "geojson";

declare var shpwrite: any
declare var tokml: any

async function exportPlainText(data: FeatureCollection): Promise<Blob> {
    const content = JSON.stringify(data)
    const blob = new Blob([content], { type: 'text/plain' })

    return Promise.resolve(blob)
}

async function exportCsv(data: FeatureCollection): Promise<Blob> {
    const content = data.features
        .map(feat => {
            const properties = Object.values(feat.properties).map(value => `"${value}"`)
            const geo = feat.geometry as any
            const type = `"${geo.type}"`
            const coordinates = `"${JSON.stringify(geo.coordinates)}"`

            return [...properties, type, coordinates].join()
        })
        .join('\r\n')

    const blob = new Blob([content], { type: 'text/csv' })

    return Promise.resolve(blob)
}

async function exportShp(data: FeatureCollection): Promise<Blob> {
    const content = await shpwrite.zip(data)
    const blob = new Blob([content], { type: 'application/x-zip' })

    return Promise.resolve(blob)
}

async function exportKml(data: FeatureCollection): Promise<Blob> {
    const content = tokml(data)
    const blob = new Blob([content], { type: 'application/vnd' })

    return Promise.resolve(blob)
}

export default {
    'TXT': {
        extension: '.txt',
        export: exportPlainText
    },
    'CSV': {
        extension: '.csv',
        export: exportCsv
    },
    'SHP': {
        extension: '.zip',
        export: exportShp
    },
    'KML': {
        extension: '.kml',
        export: exportKml
    }
}
