import { redirect, fail } from '@sveltejs/kit';
import { saveFormUpload, generateSlugFromTitle, getCsvHeader, transformCsv } from '$lib/server/mapdata';
import type { MapData, MapDataColumnIndex } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    const formstate = cookies.get('state');
    if (!formstate) {
        cookies.set('state', JSON.stringify({}), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        return {
            state: {},
        };
    }
    try {
        const state = JSON.parse(formstate);
        return {
            state: state,
        };
    }
    catch (err) {
        return {
            state: {},
        };
    }
}) satisfies PageServerLoad;


export const actions = {
    resetstate: async ({ cookies }) => {
        cookies.set('state', JSON.stringify({}), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        throw redirect(303, '/import?step=1');
    },
    upload: async ({ cookies, request }) => {
        const formData = await request.formData();
        const dsfile = formData.get('dssrc') as File;
        const dsname = formData.get('dsname') as string;
        if (!dsname) {
            return fail(400, {
                error: true,
                message: 'No dataset name provided',
                dsname: null,
            });
        }
        if (!dsfile?.name || dsfile.name === 'undefined') {
            return fail(400, {
                error: true,
                message: 'No file uploaded',
                dsname: dsname,
            });
        }
        // const file = formData.dssrc as File;
        if (!dsfile.name.endsWith('.csv')) {
            return fail(400, {
                error: true,
                message: 'Invalid file type',
                dsname: dsname,
            });
        }
        // limit to 1GB
        if (dsfile.size > 1024 * 1024 * 1024) {
            return fail(400, {
                error: true,
                message: 'File too large',
                dsname: dsname,
            });
        }
        const slug = generateSlugFromTitle(dsname);
        const filename = await saveFormUpload(dsfile, slug);

        const csvHeader = await getCsvHeader(filename);

        cookies.set('state', JSON.stringify({
            dsname: dsname,
            filename: filename,
            slug: slug,
            csvHeader: csvHeader,
        }), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        throw redirect(303, '/import?step=2');

    },
    configure: async ({ cookies, request }) => {
        const formstate = cookies.get('state');
        if (!formstate) {
            return fail(400, {
                error: true,
                message: 'Your file got lost somehow 😢',
            });
        }
        const state = JSON.parse(formstate);
        // this function needs to be refactored, it's garbage
        const formData = await request.formData();
        const colmap = {
            lat: formData.get('lat') as string,
            lng: formData.get('lng') as string,
            label: formData.get('label') as string,
            description: formData.get('description') as string,
            date: formData.get('date') as string,
            category: formData.get('category') as string,
            radius: formData.get('radius') as string,
            intensity: formData.get('intensity') as string,
        };
        // const filename = formData.get('filename') as string;
        // const dsname = formData.get('dsname') as string;
        // const slug = formData.get('slug') as string;
        const description = formData.get('dsdesc') as string;

        if (!state.filename || !state.dsname || !state.slug) {
            cookies.set('state', JSON.stringify({}), {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });
            return fail(400, {
                error: true,
                message: 'Your file got lost somehow 😢',
            });
        }

        // validate colmap
        // all values should be unique, all values should be an integer
        // only lat and lng are required
        const colmapValues = Object.values(colmap);
        const colmapKeys = Object.keys(colmap);
        // check if all values are unique (excluding null)
        colmapValues.forEach(element => {
            if (colmapValues.filter((v) => v === element).length > 1 && element !== null) {
                return fail(400, {
                    error: true,
                    message: 'Column selection must be unique 🤔',
                });
            }
        });
        if (!colmap.lat || !colmap.lng) {
            return fail(400, {
                error: true,
                message: 'Latitude and longitude are required',
            });
        }
        if (!colmapKeys.includes('lat') || !colmapKeys.includes('lng')) {
            return fail(400, {
                error: true,
                message: 'Latitude and longitude are required',
            });
        }
        
        // now validate all values are integers
        const colmapIntegers = colmapValues.map((v) => {
            return v === null || Number.isInteger(parseInt(v));
        });
        
        if (!colmapIntegers.every((v) => v === true)) {
            return fail(400, {
                error: true,
                message: 'Something went wrong with the column selection',
            });
        }
        // if we are here, we should be pretty good to go

        const meta: MapData = {
            name: state.dsname,
            slug: state.slug,
            description: description,
            init: { // this is a placeholder, user/map selection can be implemented later
                lat: 0,
                lng: 0,
                zoom: 2
            },
            hasLabel: colmap.label ? true : false,
            hasDescription: colmap.description ? true : false,
            hasDate: colmap.date ? true : false,
            hasCategory: colmap.category ? true : false,
            hasRadius: colmap.radius ? true : false,
            hasIntensity: colmap.intensity ? true : false,
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

        const colmapIndex: MapDataColumnIndex = {
            lat: parseInt(colmap.lat),
            lng: parseInt(colmap.lng),
            label: colmap.label ? parseInt(colmap.label) : undefined,
            description: colmap.description ? parseInt(colmap.description) : undefined,
            date: colmap.date ? parseInt(colmap.date) : undefined,
            category: colmap.category ? parseInt(colmap.category) : undefined,
            radius: colmap.radius ? parseInt(colmap.radius) : undefined,
            intensity: colmap.intensity ? parseInt(colmap.intensity) : undefined,
        };

        const transformedCsv = await transformCsv(state.filename, colmapIndex, meta);
        cookies.set('state', JSON.stringify({}), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        // now we can redirect to the map page
        throw redirect(303, `/mapview/${state.slug}`);
    },

} satisfies Actions;
