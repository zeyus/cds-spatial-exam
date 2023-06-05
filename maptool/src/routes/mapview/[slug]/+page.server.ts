import { error } from '@sveltejs/kit';
// we need to handle non-existing files
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'path';
import { loadMapMeta, loadMapDataPOIs } from '$lib/server/mapdata';

export async function load({ params }) {
    const safeslug = params.slug.replace(/\.\./g, '').replace(/\//g, '');
    try {
        const meta = await loadMapMeta(safeslug);
        const pois = await loadMapDataPOIs(safeslug);
        // console.log(pois[0]);
        // console.log(meta);
        return {
            mapdata: {
                meta,
                pois
            }
        };
    } catch (err) {
        console.error(err);
        throw error(404, 'Map not found');
    }
    
}