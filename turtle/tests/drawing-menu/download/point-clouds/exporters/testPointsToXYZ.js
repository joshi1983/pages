import { createTestDrawingWith3DPointCloud } from '../../../../helpers/createTestDrawingWith3DPointCloud.js';
import { drawingToPoints } from
'../../../../../modules/drawing-menu/download/point-clouds/drawingToPoints.js';
import { format, pointsToXYZ } from '../../../../../modules/drawing-menu/download/point-clouds/exporters/pointsToXYZ.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

function testFormat(logger) {
	const cases = [
	{'in': -0.70136, 'out': '       -0.70136'},
	{'in': 0, 'out': '        0.00000'},
	];
	testInOutPairs(cases, format, logger);
}

function testPointsToXYZGeneral(logger) {
	const drawing = createTestDrawingWith3DPointCloud();
	const cloudPoints = drawingToPoints(drawing);
	[true, false].forEach(function(includeAtom) {
		let fileContent = pointsToXYZ(cloudPoints, includeAtom);
		if (typeof fileContent !== 'string')
			logger(`Expected a string but got ${fileContent}`);
	});
}

export function testPointsToXYZ(logger) {
	wrapAndCall([
		testFormat,
		testPointsToXYZGeneral
	], logger);
};