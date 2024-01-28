import { CanvasVector2DDrawer } from '../../drawing/drawers/CanvasVector2DDrawer.js';
import { GraphicsScreen } from '../GraphicsScreen.js';
import { Settings } from '../../Settings.js';
import { Vector3D } from '../../drawing/vector/Vector3D.js';
const button = document.getElementById('cursor-status-turtle-camera');

function moveCamera() {
	const z = GraphicsScreen.camera.position.getZ();
	const pos = Settings.turtle.pos();
	GraphicsScreen.camera.position.assign(new Vector3D(-pos[0], -pos[1], z));
	GraphicsScreen.redraw();
}

function isTurtleOffScreen() {
	const drawer = GraphicsScreen.drawer;

	// if not using the vector 2D drawer, just keep the button invisible.
	// We might deal with 3D drawers later.
	if (!(drawer instanceof CanvasVector2DDrawer))
		return false;

	const pos = Settings.turtle.pos();
	const camera = GraphicsScreen.camera;
	const dimensions = GraphicsScreen.getCanvasDimensions();
	const pixelPosition = drawer.getTranslatedPosition(camera.transform(new Vector3D(pos)));
	return pixelPosition.getX() < 0 || pixelPosition.getY() < 0 || pixelPosition.getX() > dimensions.w || pixelPosition.getY() > dimensions.h;
}

function refreshVisibility() {
	if (isTurtleOffScreen())
		button.style.display = 'inline-block';
	else
		button.style.removeProperty('display');
}

button.addEventListener('click', moveCamera);

setInterval(refreshVisibility, 1000);