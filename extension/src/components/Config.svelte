<script lang="ts">
	const url = "https://ultimatecc.net";
	const dashboardUrl = url + "/dashboard";
</script>

<main>
	<div>
		<h2>Thanks for installing <a href={url} target="_blank" rel="noreferrer">Ultimate Closed Captions</a></h2>
		<p>
			For a better viewer experience, install this extension as an <strong>overlay</strong>
		</p>
		<p>
			To work correctly, this extension requires you to use the dashboard at
			<a href={ dashboardUrl } target="_blank" rel="noreferrer">{ dashboardUrl }</a>
		</p>
	</div>
</main>

<style>
	main { background-color: #37373E; color: #D9D9D9; font-family: Arial, Helvetica, sans-serif; font-size: 1.5em; height: 100%; }
	main { display: flex; align-items: center; justify-content: center; padding: 5em 2em; }
	h2 { margin-bottom: 1.5em; }
	div { text-align: center; }
	a, strong { color: #B072E8; }
	p { margin-bottom: 0.5em; }
</style>