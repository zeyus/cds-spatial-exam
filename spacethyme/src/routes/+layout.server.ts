import { listAvailableMaps } from "$lib/server/mapdata";

export function load() {
    return {
        props: {
            maps: {
                found: listAvailableMaps()
            }
        },
    };
}