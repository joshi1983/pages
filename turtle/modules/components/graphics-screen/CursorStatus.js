import { EventCoordinates } from '../EventCoordinates.js';
import { GraphicsScreen } from '../GraphicsScreen.js';
const graphicsScreenElement = GraphicsScreen.container;
const cursorStatusElement = document.getElementById('cursor-status-coordinates');

function updateStatus(event) {
	event.preventDefault();
	const coords = EventCoordinates.getRelativeXY(graphicsScreenElement, event);
	let transformedCoords = GraphicsScreen.drawer.pixelCoordinatesToTurtleCoordinates(coords);
	const scale = GraphicsScreen.getZoomScale();
	transformedCoords = transformedCoords.multiply(1.0 / scale);
	transformedCoords = transformedCoords.minus(GraphicsScreen.camera.position.getXYVector());
	const precision = Math.max(0, Math.min(6, Math.ceil(Math.log10(scale))));
	cursorStatusElement.classList.remove('hidden');
	cursorStatusElement.innerText = transformedCoords.getX().toFixed(precision) + ', ' + transformedCoords.getY().toFixed(precision);
}

function hideStatus() {
	cursorStatusElement.classList.add('hidden');
}

graphicsScreenElement.addEventListener('mousemove', updateStatus);
graphicsScreenElement.addEventListener('touchmove', updateStatus);
graphicsScreenElement.addEventListener('mouseout', hideStatus);

const CursorStatus = {};

export { CursorStatus };