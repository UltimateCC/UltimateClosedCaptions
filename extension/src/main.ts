import './assets/app.scss'
import Transcript from './components/Transcript.svelte'
import Config from './components/Config.svelte'
import Overlay from './components/Overlay.svelte'
import 'simplebar'
import 'simplebar/dist/simplebar.css'
import { initSettings } from './lib/settings'
import { twitchChannel } from './lib/twitch'

// Channel id is needed to start extension
let starting = true;
twitchChannel.subscribe((channelId)=>{
	if(starting && channelId) {
		starting = false;
		init(channelId);
	}
});

function init(channelId: string) {
	// Load correct component
	// https://dev.twitch.tv/docs/extensions/reference/#client-query-parameters

	const params = new URLSearchParams(location.search);

	// Default: Show only transcript
	let component: any = Transcript;

	// Config page
	if( ['config', 'dashboard'].includes(params.get('mode') ?? '') ) {
		component = Config;

	// Overlay
	}else if( (params.get('platform') === 'web' && params.get('anchor') === 'video_overlay' ) ) {
		component = Overlay;
	}

	app = new component({
		target: document.getElementById('app'),
		context: {
			...initSettings(channelId)
		}
	});

}

let app;
export default app