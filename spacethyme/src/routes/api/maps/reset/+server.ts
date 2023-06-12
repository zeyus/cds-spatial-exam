import { json } from '@sveltejs/kit';
import { deleteAllProcessedMaps, deleteUploadedCSVs, transformCsv, getDataDir } from '$lib/server/mapdata';
import type { MapData, MapDataColumnIndex } from '$root/lib/types.js';
import { join } from 'node:path';
import { writeFileSync, existsSync, unlinkSync, statSync } from 'node:fs';

export async function GET() {
	const filename = join(getDataDir(), '_earthquakes.csv');

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
    const resetLockFile = join(getDataDir(), '_reset.lock');
    try {
        if (existsSync(resetLockFile)) {
            const fileInfo = statSync(resetLockFile);
            const now = new Date();
            const diff = now.getTime() - fileInfo.mtime.getTime();
            // allow a minute to reset, otherwise just delete the lock file
            if (diff < 1000 * 60) {
                return json({ message: 'Reset already in progress 🔃', error: true });
            }
            unlinkSync(resetLockFile);
            
        }
        writeFileSync(resetLockFile, 'lock');
        await deleteAllProcessedMaps();
        await deleteUploadedCSVs();
        await transformCsv(filename, colmap, meta);
        unlinkSync(resetLockFile);
        return json({ message: 'Reset complete', error: false });
    } catch (e) {
        console.log(e);
    }
    
}    


