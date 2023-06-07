import { error } from '@sveltejs/kit';
// we need to handle non-existing files
import type { MapData, MapDataPOI } from '$lib/types';
import { loadMapMeta, loadMapDataPOIs } from '$lib/server/mapdata';

export async function load({ params }) {
    const safeslug = params.slug.replace(/\.\./g, '').replace(/\//g, '');
    try {
        const meta = loadMapMeta(safeslug);
        const pois = loadMapDataPOIs(safeslug);
        // console.log(pois[0]);
        // console.log(meta);
        return {
            streamed: {
                meta: new Promise<MapData>((resolve, reject) => {
                    try {
                        resolve(meta);
                    } catch (err) {
                        reject(err);
                    }
                }),
                pois: new Promise<MapDataPOI[]>((resolve, reject) => {
                    try {
                        resolve(pois);
                    } catch (err) {
                        reject(err);
                    }
                    
                }),
            }
        };
    } catch (err) {
        console.error(err);
        throw error(404, 'Map not found');
    }
    
}