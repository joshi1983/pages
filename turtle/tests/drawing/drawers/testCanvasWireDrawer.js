import { CanvasWireDrawer } from '../../../modules/drawing/drawers/CanvasWireDrawer.js';
import { createTestDrawing } from '../../helpers/createTestDrawing.js';
import { createTestPath } from '../../helpers/createTestPath.js';

function createCanvases() {
	const result = [];
	for (let i = 0; i < 3; i++) {
		const canvas = document.createElement('canvas');
		result.push(canvas);
	}
	return result;
}

export function testCanvasWireDrawer(logger) {
	const drawing = createTestDrawing();
	const canvases = createCanvases();
	const drawer = new CanvasWireDrawer(canvases, 100, 100);
	drawing.drawAsSingleLayer(drawer);
};