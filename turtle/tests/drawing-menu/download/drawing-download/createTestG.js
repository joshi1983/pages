import { SVGVector2DDrawer } from '../../../../modules/drawing/drawers/SVGVector2DDrawer.js';

export function createTestG() {
	return document.createElementNS(SVGVector2DDrawer.xmlns, 'g');
};