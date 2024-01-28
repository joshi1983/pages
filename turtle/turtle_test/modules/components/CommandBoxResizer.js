import { EventDispatcher } from '../EventDispatcher.js';
import { GraphicsScreen } from './GraphicsScreen.js';

var startDragY = 0;
var originalHeight = 0;
var isDragging = false;
const commandBoxContainer = document.querySelector('#command-box .commander-container');
const h2 = commandBoxContainer.querySelector(':scope h2');
const input = document.getElementById('command-input');
const menuBar = document.getElementById('menu-bar');
const minHeight = 2 + h2.offsetHeight + input.offsetHeight;

function getMaxHeight() {
	var result = window.innerHeight - menuBar.offsetHeight - 1;
	return result;
}

function updateDrag(event) {
	const newY = event.clientY;
	const dy = startDragY - newY;
	if (dy !== 0) {
		const newHeight = Math.min(getMaxHeight(), Math.max(minHeight, dy + originalHeight));
		commandBoxContainer.style.height = newHeight + 'px';
		CommandBoxResizer._dispatchEvent('layout', {});
	}
}

function moved(event) {
	if (isDragging) {
		updateDrag(event);
	}
}

function stopDrag(event) {
	if (isDragging) {
		updateDrag(event);
		startDragY = undefined;
		originalHeight = undefined;
		isDragging = false;
		GraphicsScreen.updateCanvasDimensions();
	}
}

function startDrag(event) {
	startDragY = event.clientY;
	originalHeight = commandBoxContainer.offsetHeight;
	isDragging = true;
}

h2.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', moved);
window.addEventListener('mouseup', stopDrag);

class PrivateCommandBoxResizer extends EventDispatcher {
	constructor() {
		super(['layout']);
	}

	getHeight() {
		return commandBoxContainer.offsetHeight;
	}

	getWidth() {
		return commandBoxContainer.offsetWidth;
	}
}

const CommandBoxResizer = new PrivateCommandBoxResizer();
export { CommandBoxResizer };