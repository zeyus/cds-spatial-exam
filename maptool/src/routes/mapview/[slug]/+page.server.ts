import { error } from '@sveltejs/kit';
// we need to handle non-existing files
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export function load({ params }) {
    const filename = join(process.cwd(), 'data', 'processed', `${params.slug}.json`);
    
    existsSync(filename) || error(404, 'map not found');

    const jsonMapData = readFileSync(filename, 'utf-8');
    const mapData = JSON.parse(jsonMapData);

    return {
        props: {
            mapData
        }
    };
}