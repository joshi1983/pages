import { CanvasVector2DDrawer } from '../../modules/drawing/drawers/CanvasVector2DDrawer.js'

export function createTestCanvas2DDrawer() {
	const canvases = [];
	for (let i = 0; i < 3; i++) {
		canvases.push(document.createElement('canvas'));
	}
	return new CanvasVector2DDrawer(canvases, 100, 100);
};