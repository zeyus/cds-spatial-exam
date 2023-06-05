import { error } from '@sveltejs/kit';
// we need to handle non-existing files
import fs from 'fs';

export function load({ params }) {
    const filename = `./static/data/processed/${params.slug}.json`;
    
    fs.existsSync(filename) || error(404, 'map not found');

    const jsonMapData = fs.readFileSync(filename, 'utf-8');
    const mapData = JSON.parse(jsonMapData);

    return {
        props: {
            mapData
        }
    };
}