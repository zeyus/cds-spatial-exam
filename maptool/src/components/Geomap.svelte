<script lang="ts">
    import type { MapDataPOI } from '$lib/types';
    import L, { type LatLngExpression, type MapOptions } from 'leaflet';
    import 'leaflet.markercluster';
    import 'leaflet/dist/leaflet.css';
    import 'leaflet.markercluster/dist/MarkerCluster.css';
    import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

    export let markers: Array<MapDataPOI>;

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
        attributionControl: false,
        center: initialView,
        zoom: 10,
        preferCanvas: true,
    };

    // Create map
    function createMap(container: HTMLElement) {
        let m = L.map(container, mapOptions);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(m);
        return m;   
    }

    // Handle map creation and destruction
    let map: L.Map | null = null;
    function mapAction(container: HTMLElement) {
        map = createMap(container); 
        if (markers) {
            const markerCluster = L.markerClusterGroup();
            markers.forEach(marker => {
                markerCluster.addLayer(createMarker(marker));
            });
            map.addLayer(markerCluster);
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

    function formatDate(date: Date) {
        return date.toLocaleDateString('en-GB', {
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