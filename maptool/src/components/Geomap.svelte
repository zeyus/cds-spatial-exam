<script lang="ts">
    import L, { type LatLngExpression, type MapOptions } from 'leaflet';
    import 'leaflet/dist/leaflet.css';

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