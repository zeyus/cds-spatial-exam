/**
 * @file mapdata.ts
 * @description Utilities for loading map data from CSV files and saving it as JSON.
 */
import { 
    parse,
    type Parser,
    type CastingFunction,
    type Options,
    type CastingContext
} from 'csv-parse';
import { createReadStream, existsSync, createWriteStream } from 'node:fs';
import { writeFile, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { MapData, MapDataPOI, MapDataColumnIndex } from '$lib/types';
import { Readable } from 'node:stream';


/**
 * @description Return the path to the data directory.
 */
export function getDataDir(): string {
    return join(process.cwd(), 'data');
}

/**
 * @description Return the path to the processed data directory.
 * @returns {string} The path to the processed data directory.
 */
export function getProcessedDir(): string {
    return join(getDataDir(), 'processed');
}


/**
 * @description Load map data from a CSV file.
 * @param {string} filename The name of the CSV file to load.
 * @param {Options} options The options to pass to the CSV parser.
 * @returns {Promise<Parser>} A promise that resolves to a CSV parser.
 * @throws {Error} If the file does not exist.
 */
async function loadCsvParser(filename: string, options: Options | null = null): Promise<Parser> {
    // Check if the file exists.
    const fileExists = existsSync(filename);
    if (!fileExists) {
        throw new Error(`File ${filename} does not exist.`);
    }

    // load default options if not specified
    if (options === null) {
        options = parserConfig();
    }

    // create the parser
    const parser = createReadStream(filename)
                    .pipe(parse(options));
    
    return parser;
}

function parserConfig(indexed: boolean = true, cast_fn: CastingFunction | null = null): Options {
    // default options
    const options: Options = {
        skip_empty_lines: true,
        columns: false,
    };

    // load as Object if indexed, else as Array
    if (!indexed) {
        options.columns = true;
    }

    // cast values if a casting function is provided
    if (cast_fn !== null) {
        options.cast = cast_fn;
    }

    return options;
}


/**
 * @description Get the header of a CSV file.
 * @param {string} filename The name of the CSV file to load.
 * @returns {Promise<Object>} A promise that resolves to the header of the CSV file.
 */
export async function getCsvHeader(filename: string): Promise<Object> {
    const parser = await loadCsvParser(filename);
    const header = await new Promise<Object>(async (resolve, reject) => {
        for await (const chunk of parser) {
            resolve(chunk);
            break;
        }
    });

    return header;
}

/**
 * @description Get the function for casting the values we care about.
 * @param {string} dest The name of the value to cast.
 * @returns {CallableFunction} A function that casts the value to the desired type.
 */
function castMapDataPOIValue(dest: string): CallableFunction {
    // we really only have 3 types of values: floats, dates, and strings
    switch (dest) {
        case 'lat':
        case 'lng':
        case 'intensity':
        case 'radius':
            return parseFloat;
        case 'date':
            return Date.parse;
        default:
            return (x: any): any => x;
    }
}

/**
 * @description Generate a casting function for the map data.
 * @param {MapDataColumnIndex} colmap The mapping of data to columns.
 * @returns {CastingFunction} A casting function for the map data.
 */
function castMapDataPOI(colmap: MapDataColumnIndex): CastingFunction {
    const indices: number[] = [];
    const method: CallableFunction[] = [];
    for (const [k, v] of Object.entries(colmap)) {
        if (v === undefined) {
            continue;
        }
        indices.push(v);
        method.push(castMapDataPOIValue(k));
    }
    const keep = new Set(indices);

    const cast: CastingFunction = (value: any, context: CastingContext): any => {
        /* @ts-ignore */
        if (!context.header && keep.has(context.column)) {
            /* @ts-ignore */
            value = method[indices.indexOf(context.column)](value);
        }
        return value;
    };
        
    return cast;
}

/**
 * @description Transform the csv data into a JSON array of POIs.
 * @param {Parser} parser The CSV parser.
 * @param {MapDataColumnIndex} colmap The mapping of data to columns.
 * @param {MapData} meta The metadata for the map.
 * @returns {AsyncGenerator<string | null, void, unknown>} A generator that yields the transformed data.
 */
async function* streamTransformCsv(parser: Parser, colmap: MapDataColumnIndex, meta: MapData): AsyncGenerator<string | null, void, unknown> {
    // we can ignore the header
    let header = true;
    let firstRow = true;
    
    // row by row we can stream the transformed data to the output stream
    yield '[';
    for await (const chunk of parser) {
        if (header) {
            header = false;
            continue;
        }
        if(chunk === null) {
            break;
        }
        /* @ts-ignore */
        const row: MapDataPOI = {};
        for (const [k, v] of Object.entries(colmap)) {
            if (v === undefined) {
                continue;
            }
            /* @ts-ignore */
            row[k] = chunk[v];
            // update the metadata
            updateMeta(meta, k, chunk[v]);
        }
        yield (firstRow ? '' : ',') + JSON.stringify(row);
        firstRow = false;
    }
    yield ']';
}

/**
 * @description Write the map metadata to a JSON file.
 * @param {MapData} meta The map metadata.
 * @param {string} filename The name of the loaded csv.
 * @returns {Promise<void>} A promise that resolves when the metadata is written.
 */
async function writeMapMeta(meta: MapData, filename: string): Promise<void> {
    const metafile = join(getProcessedDir(), meta.slug + '.meta.json');
    await writeFile(metafile, JSON.stringify(meta));
}

/**
 * @description Read the map metadata from a JSON file.
 * @param {string} slug The slug of the map.
 * @returns {Promise<MapData>} A promise that resolves to the map metadata.
 */
export async function loadMapMeta(slug: string): Promise<MapData> {
    try {
        const metafile = join(getProcessedDir(), slug + '.meta.json');
        const meta = await readFile(metafile, 'utf-8');
        const mapdata = JSON.parse(await meta);
        if (mapdata.hasDate) {
            mapdata.dateRange.min = parseInt(mapdata.dateRange.min);
            mapdata.dateRange.max = parseInt(mapdata.dateRange.max);
        }
        if (mapdata.hasIntensity) {
            mapdata.intensityRange.min = parseFloat(mapdata.intensityRange.min);
            mapdata.intensityRange.max = parseFloat(mapdata.intensityRange.max);
        }
        if (mapdata.hasRadius) {
            mapdata.radiusRange.min = parseFloat(mapdata.radiusRange.min);
            mapdata.radiusRange.max = parseFloat(mapdata.radiusRange.max);
        }
        return mapdata;
    }  catch (err) {
        return Promise.reject(err);
    }
}

function resetMeta(meta: MapData): MapData {
    meta['dateRange'] = { min: Infinity, max: -Infinity};
    meta['intensityRange'] = { min: Infinity, max: -Infinity, scalefactor: 1.0 };
    meta['radiusRange'] = { min: Infinity, max: -Infinity };
    meta['categories'] = [];
    return meta;
}


function updateMeta(meta: MapData, key: string, value: any): MapData {
    switch (key) {
        case 'date':
            if (meta.dateRange.min === undefined || value < meta.dateRange.min) {
                meta.dateRange.min = value;
            }
            if (meta.dateRange.max === undefined || value > meta.dateRange.max) {
                meta.dateRange.max = value;
            }
            break;
        case 'intensity':
            if (value < meta.intensityRange.min) {
                meta.intensityRange.min = value;
            }
            if (value > meta.intensityRange.max) {
                meta.intensityRange.max = value;
            }
            break;
        case 'radius':
            if (value < meta.radiusRange.min) {
                meta.radiusRange.min = value;
            }
            if (value > meta.radiusRange.max) {
                meta.radiusRange.max = value;
            }
            break;
        case 'category':
            if (!meta.categories.includes(value)) {
                meta.categories.push(value);
            }
            break;
    }
    return meta;
}



/**
 * @description Transform a CSV file into a list of map data.
 * @param {string} filename The name of the CSV file to load.
 * @param {MapDataColumnIndex} colmap The mapping of data to columns.
 * @returns {Promise<void>} A promise that resolves when the transformation is complete.
 */
export async function transformCsv(filename: string, colmap: MapDataColumnIndex, meta: MapData): Promise<void> {
    // preprare and load parser
    const cast: CastingFunction = castMapDataPOI(colmap);
    const options = parserConfig(true, cast);
    const parser = await loadCsvParser(filename, options);

    // create the output filename
    const mapdatafile = join(dirname(filename), 'processed', meta.slug + '.json');
    
    // create the output stream
    const outdata = createWriteStream(mapdatafile, 'utf-8');

    // reset the metadata
    meta = resetMeta(meta);
    // transform the data
    const iterator = streamTransformCsv(parser, colmap, meta);

    // create a readable stream from the iterator
    const readable = Readable.from(iterator);
    
    // pipe the readable stream to the output stream
    readable.pipe(outdata);

    // wait for the output stream to finish
    return new Promise<void>((resolve, reject) => {
        outdata.on('finish', async () => {
            // write the metadata
            await writeMapMeta(meta, filename);
            resolve();
        });
        outdata.on('error', (err) => {
            reject(err);
        });
    });
}

export async function loadMapDataPOIs(slug: string): Promise<MapDataPOI[]> {
    const mapdatafile = join(getProcessedDir(), slug + '.json');
    try {
        const mapdata = await readFile(mapdatafile, 'utf-8');
        return JSON.parse(await mapdata);
    } catch (err) {
        return Promise.reject(err);
    }
}


export function generateSlugFromTitle(title: string, maxlen: number = 50): string {
    // replace all non-alphanumeric characters with a dash
    const slug = title.replace(/[^a-zA-Z0-9]/g, '-').substring(0, maxlen);
    return slug;
}

export async function saveFormUpload(file: File, slug: string): Promise<string> {
    const filename = join(getDataDir(), slug + '.csv');
    await writeFile(filename, await file.text());
    return filename;
}