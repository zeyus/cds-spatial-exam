<script lang="ts">
    import type { MapData, MapDataPOI, MapDateRange } from '$lib/types';
    import L, { type LatLngExpression, type MapOptions } from 'leaflet';
    import noUiSlider from 'nouislider';
    import '$lib/wNumb';
    import 'leaflet.markercluster';
    import 'leaflet-loading';
    import 'nouislider/dist/nouislider.css';
    import 'leaflet/dist/leaflet.css';
    import 'leaflet.markercluster/dist/MarkerCluster.css';
    import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
    import 'leaflet-loading/src/Control.Loading.css';
	import { onMount } from 'svelte';


    export let markers: Array<MapDataPOI> | Promise<Array<MapDataPOI>>;
    export let metadata: MapData | Promise<MapData>;

    let mounted = false;
    onMount(() => {
        mounted = true;
    });

    // Set initial map view location
    const initialView: LatLngExpression = {
        lat: 56.172808,
        lng: 10.206089,
    };

    const defaultIcon = L.icon({
        iconUrl: '/basicmarker.png',
        iconSize: [32, 32],
        iconAnchor: [30, 30],
        popupAnchor: [0, -30],
    });

    const defaultMarkerOpts: L.MarkerOptions = {
        icon: defaultIcon,
    };

    const defaultTooltipOpts: L.TooltipOptions = {
        direction: 'top',
        permanent: true,
        opacity: 0.8,
    };

    const defaultPopupOpts: L.PopupOptions = {
        maxWidth: 400,
        minWidth: 200,
        maxHeight: 400,
        autoPan: true,
        keepInView: true,
        closeButton: true,
    };

    const mapOptions: MapOptions = {
        zoomControl: true,
        attributionControl: true,
        center: initialView,
        zoom: 10,
        preferCanvas: true,
        loadingControl: true,
    };

    const dateRange: MapDateRange = {
        start: undefined, 
        end: undefined,
    };

    let map: L.Map | null = null;
    
    const markerCluster = L.markerClusterGroup({
        chunkedLoading: true,
        chunkProgress: (processed, total, elapsed) => {
            if (processed >= total) {
                if (map) {
                    map.fire('dataload');
                }
            }
        },
    });

    function chunkArray(array: any[], size: number) {
        var result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }

    async function filterAsync(array: any[], callback: any) {
        // Split the array into smaller chunks
        var chunks = chunkArray(array, 500); // adjust chunk size to a suitable number
        var result: any[] = [];
        for (let i = 0; i < chunks.length; i++) {
            // Add a delay to allow the browser to update
            await new Promise(resolve => setTimeout(resolve, 0));
            result = result.concat(chunks[i].filter(callback));
        }
        return result;
    }

    async function filterMarkersByDateRange(markers: Array<MapDataPOI>, meta: MapData, start: number, end: number, range: MapDateRange) {
        return await filterAsync(markers, (marker: MapDataPOI) => {
            if (marker.date) {
                return marker.date >= start && marker.date <= end;
            } else {
                return false;
            }
        });
    }

    async function applyFilters(map: L.Map, meta: MapData, range: MapDateRange) {
        let filteredMarkers: Array<MapDataPOI>;
        console.log(`Filtering markers in range ${range.start} - ${range.end}`);
        map.fire('dataloading');
        if (markers instanceof Promise) {
            filteredMarkers = await filterMarkersByDateRange(await markers, meta, range.start, range.end, range);
        }else {
            filteredMarkers = await filterMarkersByDateRange(markers, meta, range.start, range.end, range);
        }
        console.log(filteredMarkers.length)
        addMarkers(map, filteredMarkers);
    }

    function resolveMapOptions(metadata: MapData) {
        if (metadata) {
            if (metadata.init) {
                mapOptions.center = [metadata.init.lat, metadata.init.lng];
                mapOptions.zoom = metadata.init.zoom;
            }
            if (metadata.hasDate) {
                dateRange.start = metadata.dateRange.min;
                dateRange.end = metadata.dateRange.max;
                console.log(dateRange);
            }
        }
    }

    function resolveMapControls(map: L.map, container: HTMLElement) {
        if (metadata !== undefined && metadata?.hasDate) {
            let Slider = L.Control.extend({
                options: {
                    position: 'topright',
                },
                onAdd: function () {
                    let controlSlider = L.DomUtil.create('div', 'map-slider', container);
                    // here we can fill the slider with colors, strings and whatever
                    createSlider(controlSlider);
                    // controlSlider.style.width = '75vw';
                    controlSlider.style.height = '75vh';
                    controlSlider.style.marginRight = '5vw';
                    controlSlider.style.marginTop = '5vh';
                    return controlSlider;
                },
            });
            map.addControl(new Slider());
        }
    }

    // Create map
    async function createMap(container: HTMLElement) {
        if (metadata instanceof Promise) {
            console.log('Waiting for metadata to resolve...');
            resolveMapOptions(await metadata);
            console.log('Metadata resolved, creating map...');
        } else {
            resolveMapOptions(metadata);
        }
        
        let m = L.map(container, mapOptions);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            className: 'map-tiles',
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(m);
        resolveMapControls(m, container);
        m.addLayer(markerCluster);
        return m;   
    }

    async function addMarkers(map: L.Map, markers: Array<MapDataPOI>) {
        map.fire('dataloading');
        markerCluster.clearLayers()
        const mapMarkers: Array<L.Marker> = [];
        // chunk array for browser performance
        const chunks = chunkArray(markers, 500);
        for (let i = 0; i < chunks.length; i++) {
            // Add a delay to allow the browser to update
            await new Promise(resolve => setTimeout(resolve, 0));

            chunks[i].forEach(marker => {
                mapMarkers.push(createMarker(marker));
            });
        }

        markerCluster.addLayers(mapMarkers, true);
    }

    // Handle map creation and destruction
    async function mapAction(container: HTMLElement) {
        map = await createMap(container); 
        if (markers) {
            // If markers are passed as a promise, wait for them to resolve
            if (markers instanceof Promise) {
                console.log('Waiting for markers to resolve...');
                markers.then((markers) => {
                    console.log('Markers resolved, adding to map...');
                    if (map !== null) {
                        addMarkers(map, markers);
                    }
                });
            } else {
                addMarkers(map, markers);
            }
        }
        return {
            destroy: () => {
                if (map) {
                        map.remove();
                        map = null;
                }
            }
        };
    }

    function mapActionWrapper(container: HTMLElement) {
        mapAction(container);
    }

    // Handle window resize
    function resizeMap() {
        if(map) { map.invalidateSize(); }
    }


    function formatDate(date: number, day: boolean = true) {

        return new Date(date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: day ? 'numeric' : undefined,
        });
    }

    function dateYear(date: number) {
        return new Date(date).getFullYear();
    }

    function createMarker(marker: MapDataPOI) {
        let m = L.marker([marker.lat, marker.lng], defaultMarkerOpts);
        if (marker.label) {
            m.bindTooltip(marker.label, defaultTooltipOpts);
        }
        let popupContent = '';
        if (marker.label && marker.date) {
            popupContent += `<b>${formatDate(marker.date)}: ${marker.label}</b>`;
        } else if (marker.label) {
            popupContent += `<b>${marker.label}</b>`;
        } else if (marker.date) {
            popupContent += `<b>${formatDate(marker.date)}</b>`;
        }
        if (marker.intensity) {
            popupContent += `<p>Intensity: ${marker.intensity}</p>`;
        }
        if (marker.description) {
            popupContent += `<p>${marker.description}</p>`;
        }

        m.bindPopup(popupContent, defaultPopupOpts);
        return m;
    }

    function createSlider(slider: HTMLElement) {
        // const slider = document.createElement('div');
        slider.id = 'map-slider';
        const startDateValues = [dateRange.start, dateRange.end];
        if (slider) {
            noUiSlider.create(slider, {
                behaviour: 'tap-drag',
                direction: 'rtl',
                start: startDateValues,
                orientation: 'vertical',
                connect: true,
                range: {
                    'min': dateRange.start,
                    'max': dateRange.end,
                },
                step: 86400000,
                format: wNumb({
                    decimals: 0
                }),
                pips:{
                    mode: 'count',
                    values: 10,
                    density: 8,
                    stepped: true,
                    format: {
                        to: (value) => {
                            return dateYear(value);
                        },
                        from: (value) => {
                            return Date.parse(value);
                        }
                    }
                },
                tooltips: [
                    {
                        to: (value) => {
                            return formatDate(value, false);
                        },
                        from: (value) => {
                            return Date.parse(value);
                        }
                    },
                    {
                        to: (value) => {
                            return formatDate(value, false);
                        },
                        from: (value) => {
                            return Date.parse(value);
                        }
                    }
                ]
            });
            document.querySelectorAll('.noUi-tooltip').forEach((el) => {
                el.classList.add('hidden');
            });
            slider.noUiSlider.on('start', (values, handle) => {
                // show tooltips
                document.querySelectorAll('.noUi-tooltip').forEach((el) => {
                    el.classList.remove('hidden');
                });
            });
            slider.noUiSlider.on('change', (values, handle) => {
                console.log(values);
                // hide tooltips
                document.querySelectorAll('.noUi-tooltip').forEach((el) => {
                    el.classList.add('hidden');
                });
                if(map) {
                    map.fire('dataloading');
                
                    applyFilters(map, metadata, {
                            start: parseInt(values[0]),
                            end: parseInt(values[1])
                    });
                }
                //startDateValues[handle].innerHTML = formatDate(+values[handle]);
                // if (handle === 0) {
                //     dateRange.start = new Date(parseInt(values[0]));
                // } else {
                //     dateRange.end = new Date(parseInt(values[1]));
                // }
            });
        }
    }

</script>
<svelte:window on:resize={resizeMap} />
<style>
	/* .map :global(.marker-text) {
		width:100%;
		text-align:center;
		font-weight:600;
		background-color:#444;
		color:#EEE;
		border-radius:0.5rem;
	}
	
	.map :global(.map-marker) {
		width:30px;
		transform:translateX(-50%) translateY(-25%);
	} */

</style>
{#if mounted}
<div id="map" style="height:100%;width:100%" use:mapActionWrapper>
</div>
{/if}
