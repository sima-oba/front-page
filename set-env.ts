const writeFile = require('fs').writeFile;

require('dotenv').config();

if (process.env.BASE_URL === undefined) {
    throw Error('Missing BASE_URL env variable')
}

const target = './src/environments/environment.prod.ts'
const baseUrl = process.env.BASE_URL
const mapKey = process.env.MAP_KEY
const environmentContent = `
    export const environment = {
    production: true,
    baseUrl: '${baseUrl}',
    mapKey: '${mapKey}'
};
`

console.debug(`overwriting ${target} file`)
console.debug(environmentContent)

writeFile(target, environmentContent, (err: any) => {
    if (err) throw console.error(err)
});
