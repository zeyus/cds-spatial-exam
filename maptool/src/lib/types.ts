/**
 * @file types.ts
 * @description Types used throughout the project.
 */

interface MapData {
    // The name of the map.
    name: string;
    // The map slug (generated from the name).
    slug: string;
    // Initial map center.
    init: {
        lat: number,
        lng: number,
        zoom: number,
    };
    // The map description.
    description: string | undefined;
    // Do the map points have labels?
    hasLabel: boolean;
    // Do the map points have descriptions?
    hasDescription: boolean;
    // Do the map points have categories?
    hasCategory: boolean;
    // Do the map points have a radius?
    hasRadius: boolean;
    // Do the map points have an intensity?
    hasIntensity: boolean;
    // Do the map points have a date?
    hasDate: boolean;
}

// Define marker data type
interface MapDataPOI {
    lat: number;
    lng: number;
    // optional
    label: string | undefined;
    description: string | undefined;
    date: Date | undefined;
    category: string | undefined;
    radius: number | undefined;
    intensity: number | undefined;
};

// Define data -> column index mapping
interface MapDataColumnIndex {
    lat: number;
    lng: number;
    label: number | undefined;
    description: number | undefined;
    date: number | undefined;
    category: number | undefined;
    radius: number | undefined;
    intensity: number | undefined;
};


export type {MapData, MapDataPOI, MapDataColumnIndex};