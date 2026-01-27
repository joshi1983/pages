import { Modes, setMode } from './Modes.js';
import { ready } from './ready.js';

function init() {
	const button = document.getElementById('startGameLoop');
	button.addEventListener('click', function() {
		setMode(Modes.PLAYING);
	});
}
ready(init);