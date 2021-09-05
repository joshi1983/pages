import { ArcShape } from '../../modules/drawing/vector/shapes/ArcShape.js';
import { CanvasVector2DDrawer } from '../../modules/drawing/drawers/CanvasVector2DDrawer.js';
import { Colour } from '../../modules/Colour.js';
import { PathShape } from '../../modules/drawing/vector/shapes/PathShape.js';
import { ShapeStyle } from '../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../modules/drawing/vector/Vector3D.js';

let drawer;
let foregroundCanvas;

function getShapeFromInputs() {
	const x = document.getElementById('center-x');
	const y = document.getElementById('center-y');
	const radius = document.getElementById('radius');
	const rotationAngle = document.getElementById('rotation-angle');
	const angle = document.getElementById('angle');
	const center = new Vector3D(num(x), num(y), 0);
	const rotationRadians = num(rotationAngle) * Math.PI / 180;
	const angleRadians = num(angle) * Math.PI / 180;
	const radius1 = num(radius);
	return new ArcShape(center, rotationRadians, radius1, angleRadians);
}

function refreshCanvas() {
	const shape = getShapeFromInputs();
	const box = foregroundCanvas.getBoundingClientRect();
	foregroundCanvas.setAttribute('width', Math.round(box.width));
	foregroundCanvas.setAttribute('height', Math.round(box.height));
	drawer.setDimensions(box.width, box.height);
	const ctx = foregroundCanvas.getContext('2d');
	drawer.drawArc(shape, ctx);

	// FIXME: draw bounding box.
	const box2 = shape.getBoundingBox();
	const style = new ShapeStyle({'pen': {'color': new Colour('red')}});
	const points = [
		new Vector3D(box2.min.getX(), box2.min.getY(), 0),
		new Vector3D(box2.max.getX(), box2.min.getY(), 0),
		new Vector3D(box2.max.getX(), box2.max.getY(), 0),
		new Vector3D(box2.min.getX(), box2.max.getY(), 0)
	];
	const rect = new PathShape(points, true, style);
	drawer.drawShape(rect);
}

function num(e) {
	return parseFloat(e.value.trim());
}

function swapEndPoints() {
	const shape = getShapeFromInputs();
	shape.swapArcDirection();
	const rotationAngle = document.getElementById('rotation-angle');
	const angle = document.getElementById('angle');
	rotationAngle.value = shape.rotationRadians * 180 / Math.PI;
	angle.value = shape.angle * 180 / Math.PI;
	refreshCanvas();
}

function init() {
	const backgroundCanvas = document.createElement('canvas');
	const canvas2 = document.createElement('canvas');
	foregroundCanvas = document.getElementById('canvas');
	const canvases = [backgroundCanvas, foregroundCanvas, canvas2];
	drawer = new CanvasVector2DDrawer(canvases, 100, 100);
	refreshCanvas();
	const ids = ['center-x', 'center-y', 'angle', 'radius', 'rotation-angle'];
	ids.forEach(function(id) {
		const e = document.getElementById(id);
		e.addEventListener('change', refreshCanvas);
		e.addEventListener('input', refreshCanvas);
	});
	document.getElementById('swap-end-points').addEventListener('click', swapEndPoints);
}

if (document.readyState === 'loading')
	document.addEventListener('DOMContentLoaded', init);
else
	init();