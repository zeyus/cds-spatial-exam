import { writable } from 'svelte/store'

export const pageName = writable("");
export const uploadStatus = writable({});
export const resetDone = writable(false);