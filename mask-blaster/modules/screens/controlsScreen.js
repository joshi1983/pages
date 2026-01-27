import { addListener, Modes, setMode } from '../Modes.js';

let button;

addListener(function(newMode) {
	if (newMode === Modes.CONTROLS) {
		if (button === undefined) {
			button = document.getElementById('startGameLoop');
			button.addEventListener('click', function() {
				setMode(Modes.PLAYING);
			});
		}
		button.focus(); // for easier control using a keyboard
	}
});