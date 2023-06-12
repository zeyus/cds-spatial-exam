import { json } from '@sveltejs/kit';
import type { MapData } from '$lib/types';
import { loadMapMeta } from '$lib/server/mapdata';
import type { RequestHandler } from './$types';

export const GET =(async ({ params }) => {
    if (!params.slug || params.slug === '') {
        return json({ error: true, message: 'Invalid map requested 😢' });
    }
	const safeslug = params.slug.replace(/\.\./g, '').replace(/\//g, '');
    try {
        const meta: MapData = await loadMapMeta(safeslug);
        return json(meta);
    }
    catch (err) {
        console.error(err);
        return json({ error: true, message: 'Map not found 😢' });
    }
}) satisfies RequestHandler;
