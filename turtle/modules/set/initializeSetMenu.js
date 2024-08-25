import { GraphicsScreen } from '../components/GraphicsScreen.js';
import { ValueWrapper } from '../ValueWrapper.js';

const setMenuElement = document.getElementById('set-menu');

export function initializeSetMenu(settings) {
	const eventListeners = [];
	function addListeners() {
		// No need to repeatedly add handlers.
		if (eventListeners.length !== 0)
			return;
		const drawStateChangeHandler = function() {
		};
		settings.turtle.drawState.addEventListener('change', drawStateChangeHandler);
	}
	function removeListeners() {
		eventListeners.forEach(function(handler) {
			settings.turtle.removeEventListener(handler);
			settings.turtle.drawState.removeEventListener(handler);
		});
		eventListeners.length = 0;
	}
	setMenuElement.addEventListener('focus', addListeners);
	setMenuElement.addEventListener('mouseover', addListeners);
	setMenuElement.addEventListener('blur', removeListeners);
	setMenuElement.addEventListener('mouseout', removeListeners);
};