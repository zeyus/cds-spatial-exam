import { invalidate } from '$app/navigation';
import { transformCsv } from '$lib/server/mapdata';
import type { MapData, MapDataColumnIndex } from '$root/lib/types.js';
import { join } from 'node:path';


export async function load({ params }) {
    
    const filename = join(process.cwd(), 'data', '_earthquakes.csv');

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
        categories: [],
        dateRange: {
            min: undefined,
            max: undefined,
        },
        intensityRange: {
            min: undefined,
            max: undefined,
            scalefactor: undefined,
        },
        radiusRange: {
            min: undefined,
            max: undefined,
        },
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
    console.log('transforming csv');
    invalidate('data:foundmaps');
    return {
        streamed: {
            imported: new Promise<boolean>((resolve, reject) => {
                transformCsv(filename, colmap, meta).then(() => {
                    resolve(true);
                }).catch((err) => {
                    reject(err);
                });
            }),
        }
    };
    
}