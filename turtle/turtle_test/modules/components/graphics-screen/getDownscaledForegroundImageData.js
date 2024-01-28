import { asyncDownscale } from '../../drawing/drawers/canvas/asyncDownscale.js';
import { Camera } from '../../drawing/vector/Camera.js';
import { CanvasVector2DDrawer } from '../../drawing/drawers/CanvasVector2DDrawer.js';
import { GraphicsScreen } from '../GraphicsScreen.js';
let drawer = new CanvasVector2DDrawer(undefined, 100, 100);
const canvas = drawer.canvases[1];

export function getDownscaledForegroundImageData(scaleFactor) {
	const drawing = GraphicsScreen.drawing;
	const originalSize = GraphicsScreen.getCanvasDimensions();
	const newSize = {'w': originalSize.w * scaleFactor, 'h': originalSize.h * scaleFactor};
	const camera = new Camera(GraphicsScreen.camera);
	canvas.setAttribute('width', newSize.w);
	canvas.setAttribute('height', newSize.h);
	drawer.setDimensions(newSize.w, newSize.h);
	drawing.setDimensions(newSize.w, newSize.h);
	camera.setZoomScale(camera.getZoomScale() * scaleFactor);
	drawing.drawAsSingleLayer(drawer, camera);

	const result = asyncDownscale(scaleFactor, canvas);
	drawing.setDimensions(originalSize.w, originalSize.h);

	return result;
};