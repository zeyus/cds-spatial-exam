// import { redirect, fail } from '@sveltejs/kit';
// import type { Actions } from './$types';
// import path from 'path';
// import os from 'os';
// import fs from 'fs';
// import Busboy from '@fastify/busboy';

// export const actions: Actions = {
//   default: async ({ request, route, url }) => {
//     if (request.method === 'POST') {
//         const busboy = new Busboy({ headers: request.headers });
//         busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
//             let saveTo = path.join('static/data', path.basename(fieldname));
//             file.pipe(fs.createWriteStream(saveTo));
//         });
//         busboy.on('finish', () => {
//             console.log('Upload complete');
//             redirect(301, '/import');
//         });
//         return request.pipe(busboy);
//     }
// };
// };

import { getCsvHeader, transformCsv } from '$lib/server/mapdata';
import { type MapData, type MapDataColumnIndex } from '$root/lib/types.js';
import { join } from 'node:path';

export async function load({ params }) {
    const filename = join(process.cwd(), 'data', 'earthquakes.csv');

    const header = await getCsvHeader(filename);
    console.log(header);

    const meta: MapData = {
        name: 'Earthquakes',
        slug: 'earthquakes',
        description: 'Earthquakes from 1965 to 2016',
        hasCategory: true,
        hasLabel: false,
        init: {
            lat: 0,
            lng: 0,
            zoom: 2
        },
        hasIntensity: true,
        hasRadius: true,
        hasDate: true,
        hasDescription: false,
    };

    const colmap: MapDataColumnIndex = {
        lat: 2,
        lng: 3,
        intensity: 8,
        radius: 13,
        date: 0,
        category: 4,
        label: undefined,
        description: undefined,
    };

    await transformCsv(filename, colmap, meta);

    return {
        props: {
            header
        }
    };
    
}