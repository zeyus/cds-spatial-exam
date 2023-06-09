import { json } from '@sveltejs/kit';
import { listAvailableMaps } from "$lib/server/mapdata";

export async function GET() {
	const maps = await listAvailableMaps();
	return json(maps);
}