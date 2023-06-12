import { json } from '@sveltejs/kit';
import { streamMapDataPOIs } from '$lib/server/mapdata';
import type { RequestHandler } from './$types';
import type { Readable } from 'node:stream';


export const GET =(async ({ params }) => {
    if (!params.slug || params.slug === '') {
        return json({ error: true, message: 'Invalid map requested 😢' });
    }
	const safeslug = params.slug.replace(/\.\./g, '').replace(/\//g, '');
    try {
        const ac = new AbortController();
        // const meta: MapData = await loadMapMeta(safeslug);
        const pois: Promise<Readable> = streamMapDataPOIs(safeslug);

        // we want to stream the data to the client
        const stream = new ReadableStream({
            start(controller) {
                pois.then((poistream) => {
                    poistream.on('data', (chunk) => {
                        controller.enqueue(chunk);
                    });
                    poistream.on('end', () => {
                        controller.close();
                    });
                    poistream.on('error', (err) => {
                        console.error(err);
                        controller.error(err);
                    });
                }).catch((err) => {
                    console.error(err);
                    controller.error(err);
                });
            },
            cancel() {
                console.log('Stream cancelled');
                ac.abort();
            }
        });
        
            
        return new Response(stream, {
            headers: { 'Content-Type': 'application/x-ndjson' }
        });
    } catch (err) {
        console.error(err);
        return json({ error: true, message: 'Map not found 😢' });
    }

}) satisfies RequestHandler;