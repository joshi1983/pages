import { addListener, Modes, setMode } from '../Modes.js';
import { ready } from '../ready.js';

let button;
let mouseUsed = false, touchUsed = false;

function shouldGoTouchOnly() {
	if (mouseUsed === false && touchUsed === false)
		return false;
	if (mouseUsed)
		return false;
	return true;
}

addListener(function(newMode) {
	if (newMode === Modes.CONTROLS) {
		const screenElement = document.getElementById('controls-screen');
		if (shouldGoTouchOnly()) {
			screenElement.classList.add('touch-only-selected');
		}
		
		if (button === undefined) {
			button = document.getElementById('startGameLoop');
			button.addEventListener('click', function() {
				setMode(Modes.PLAYING);
			});
		}
		button.focus(); // for easier control using a keyboard
	}
});

function handleTouchEvent() {
	touchUsed = true;
}

function init() {
	window.addEventListener('mousedown', function(event) {
		mouseUsed = true;
	});
	window.addEventListener('touchstart', handleTouchEvent);
	window.addEventListener('touchend', handleTouchEvent);
}

ready(init);