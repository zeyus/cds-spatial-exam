<script lang="ts">
    // include leaflet.js from $lib, it is not a module
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    const initialView = [39.8283, -98.5795];
    function createMap(container) {
        let m = L.map(container).setView(initialView, 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(m);
        return m;   
    }
    let map;
    function mapAction(container) {
        map = createMap(container); 
        return {
        destroy: () => {
                    map.remove();
                    map = null;
                }
        };
    }

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