import { EventCoordinates } from '../EventCoordinates.js';
import { GraphicsScreen } from '../GraphicsScreen.js';
import { Vector3D } from '../../drawing/vector/Vector3D.js';
const container = GraphicsScreen.container;
const homeCameraButton = document.getElementById('cursor-status-home-camera');
let lastPoint = undefined;

function cameraPositionUpdated() {
	if (GraphicsScreen.camera.position.isZero())
		homeCameraButton.classList.add('hidden');
	else
		homeCameraButton.classList.remove('hidden');
	GraphicsScreen.redraw();
}

function moveCamera(event) {
	if (lastPoint !== undefined && (event.touches === undefined || event.touches.length === 1)) {
		const p = EventCoordinates.getRelativeXY(container, event);
		if (lastPoint !== undefined) {
			const delta = p.minus(lastPoint).multiply(1/GraphicsScreen.camera.getZoomScale());
			const pos = new Vector3D(GraphicsScreen.camera.position);
			pos.setX(pos.getX() + delta.getX());
			pos.setY(pos.getY() - delta.getY());
			GraphicsScreen.camera.position.assign(pos);
			cameraPositionUpdated();
		}
		lastPoint = p;
	}
}

function clearPoint() {
	lastPoint = undefined;
}

function startDragging(event) {
	lastPoint = EventCoordinates.getRelativeXY(container, event);
}

function homeCameraClicked() {
	GraphicsScreen.camera.position.assign([0, 0, 0]);
	cameraPositionUpdated();
}

container.addEventListener('mousedown', startDragging, {'passive': true});
container.addEventListener('mousemove', moveCamera, {'passive': true});
container.addEventListener('mouseup', clearPoint, {'passive': true});
container.addEventListener('mouseout', clearPoint, {'passive': true});
container.addEventListener('touchstart', startDragging, {'passive': true});
container.addEventListener('touchmove', moveCamera, {'passive': true});
container.addEventListener('touchend', clearPoint, {'passive': true});
homeCameraButton.addEventListener('click', homeCameraClicked);

GraphicsScreen.camera.position.addEventListener('change', cameraPositionUpdated);