import { listAvailableMaps } from "$lib/server/mapdata";

export function load({depends}) {
    depends('data:foundmaps');
    return {
        props: {
            maps: {
                found: listAvailableMaps()
            }
        },
    };
}