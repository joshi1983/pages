import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { Colour } from '../../../../modules/Colour.js';
import { createTestCanvas2DDrawer } from '../../../helpers/createTestCanvas2DDrawer.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { SVGVector2DDrawer } from '../../../../modules/drawing/drawers/SVGVector2DDrawer.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

function testWithCurveAtEnd(logger) {
	const cases = [
		[
			new Vector3D(0, 0, 0),
			new Vector3D(1, 2, 3),
			new Vector3D(5, 6, 7),
			new ArcShape(new Vector3D(5, 16, 7), 0, 10, Math.PI)
		],
		[
			new ArcShape(new Vector3D(1, 12, 3), 0, 10, Math.PI),
			new Vector3D(1, 2, 3),
			new Vector3D(6, 12, 13),
			new Vector3D(5, 16, 7),
		],
	];
	cases.forEach(function(caseInfo) {
		const path = new PathShape(caseInfo, false);
		path.style.setPenColor(new Colour('#f00'));

		// draw using canvas.
		const canvasDrawer = createTestCanvas2DDrawer();
		canvasDrawer.drawPath(path);

		// draw using SVG.
		const svgDrawer = new SVGVector2DDrawer(100, 100);
		svgDrawer.drawPath(path);
	});
}

export function testPathShapeWithCurves(logger) {
	testWithCurveAtEnd(prefixWrapper('testWithCurveAtEnd', logger));
};