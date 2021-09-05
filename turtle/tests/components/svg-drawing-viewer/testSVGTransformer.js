import { createTestG } from '../../drawing-menu/download/drawing-download/createTestG.js';
import { SVGTransformer } from '../../../modules/components/svg-drawing-viewer/SVGTransformer.js';

export function testSVGTransformer(logger) {
	const g = createTestG();
	const t = new SVGTransformer(g, 2000, 4000);
	if (t.getCentreOffset().getX() !== 1000)
		logger('x expected to be 1000 but got ' + t.getCentreOffset().getX());
	if (t.getCentreOffset().getY() !== 2000)
		logger('y expected to be 2000 but got ' + t.getCentreOffset().getY());
	t.setScale(0.5);
	if (t.translation.getX() !== 2000)
		logger('translaation x expected to be 2000 after changing scale to 0.5 but got ' + t.translation.getX());
	if (t.translation.getY() !== 4000)
		logger('translaation y expected to be 4000 after changing scale to 0.5 but got ' + t.translation.getY());
};