<script>
	import DragNDrop from './DragNDrop.svelte'
</script>

<main>
	<h1>Cat drop</h1>
	<h2>Sylvia and Bentley welcome you!</h2>
	<p>(especially if you come bearing tuna)<p>
	<DragNDrop />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>