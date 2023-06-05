import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import path from 'path';
import os from 'os';
import fs from 'fs';
import Busboy from '@fastify/busboy';

export const actions: Actions = {
  default: async ({ request, route, url }) => {
    if (request.method === 'POST') {
        const busboy = new Busboy({ headers: request.headers });
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            let saveTo = path.join('static/data', path.basename(fieldname));
            file.pipe(fs.createWriteStream(saveTo));
        });
        busboy.on('finish', () => {
            console.log('Upload complete');
            redirect(301, '/import');
        });
        return request.pipe(busboy);
    }
};
};