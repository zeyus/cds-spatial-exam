<script lang="ts">
    import type { MapData, MapDataPOI, MapDateRange } from '$lib/types';
    import L, { type LatLngExpression, type MapOptions } from 'leaflet';
    import noUiSlider from 'nouislider';
    import '$lib/wNumb';
    import 'nouislider/dist/nouislider.css';
    import 'leaflet.markercluster';
    import 'leaflet/dist/leaflet.css';
    import 'leaflet.markercluster/dist/MarkerCluster.css';
    import 'leaflet.markercluster/dist/MarkerCluster.Default.css';


    export let markers: Array<MapDataPOI> | Promise<Array<MapDataPOI>>;
    export let metadata: MapData | Promise<MapData>;

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
    };

    const dateRange: MapDateRange = {
        start: undefined, 
        end: undefined,
    };

    const markerCluster = L.markerClusterGroup();


    function filterMarkersByDateRange(markers: Array<MapDataPOI>, meta: MapData, start: number, end: number, range: MapDateRange) {
        if (!meta.hasDate) {
            return markers;
        }
        return markers.filter((marker) => {
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
        if (markers instanceof Promise) {
            filteredMarkers = filterMarkersByDateRange(await markers, meta, range.start, range.end, range);
        }else {
            filteredMarkers = filterMarkersByDateRange(markers, meta, range.start, range.end, range);
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
        if (metadata.hasDate) {
            let Slider = L.Control.extend({
                options: {
                    position: 'topright',
                },
                onAdd: function () {
                    let controlSlider = L.DomUtil.create('div', 'map-slider', container);
                    // here we can fill the slider with colors, strings and whatever
                    createSlider(controlSlider);
                    controlSlider.style.width = '75vw';
                    controlSlider.style.marginRight = '5vw';
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
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(m);
        resolveMapControls(m, container);
        m.addLayer(markerCluster);
        return m;   
    }

    function addMarkers(map: L.Map, markers: Array<MapDataPOI>) {
        markerCluster.clearLayers()
        const mapMarkers: Array<L.Marker> = [];
        markers.forEach(marker => {
            mapMarkers.push(createMarker(marker));
        });
        markerCluster.addLayers(mapMarkers, true);
    }

    // Handle map creation and destruction
    let map: L.Map | null = null;
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

    // Handle window resize
    function resizeMap() {
        if(map) { map.invalidateSize(); }
    }


    function formatDate(date: number) {

        return new Date(date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
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
                direction: 'ltr',
                start: startDateValues,
                connect: true,
                range: {
                    'min': dateRange.start,
                    'max': dateRange.end,
                },
                step: 86400000,
                tooltips: [true, true],
                format: wNumb({
                    decimals: 0
                }),
                pips:{
                    mode: 'count',
                    values: 5,
                    density: 4,
                    stepped: true,
                    format: {
                        to: (value) => {
                            return formatDate(value);
                        },
                        from: (value) => {
                            return Date.parse(value);
                        }
                    }
                }
            });
            slider.noUiSlider.on('change', (values, handle) => {
                console.log(values);
                applyFilters(map, metadata, {
                        start: parseInt(values[0]),
                        end: parseInt(values[1])
                });
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
<div id="map" style="height:100%;width:100%" use:mapAction>
</div>