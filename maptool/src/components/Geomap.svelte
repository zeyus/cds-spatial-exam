<script lang="ts">
    import L, { type LatLngExpression, type MapOptions } from 'leaflet';
    import 'leaflet/dist/leaflet.css';

    // Define marker data type
    type Marker = {
        lat: number,
        lng: number,
        label: string,
        description: string,
        date: string,
        category: string,
    };

    export let markers: Array<Marker>;

    // Set initial map view location
    const initialView: LatLngExpression = {
        lat: 56.172808,
        lng: 10.206089,
    };

    const mapOptions: MapOptions = {
        zoomControl: true,
        attributionControl: false,
        center: initialView,
        zoom: 19,
        preferCanvas: true,
    };

    // Create map
    function createMap(container: HTMLElement) {
        let m = L.map(container, mapOptions).setView(initialView, 19);
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
            markers.forEach(marker => {
                createMarker(marker).addTo(map!);
            });
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

    function createMarker(marker: Marker) {
        let m = L.marker([marker.lat, marker.lng]);
        m.bindPopup(`<b>${marker.label}</b><br>${marker.description}<br>${marker.date}<br>${marker.category}`);
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