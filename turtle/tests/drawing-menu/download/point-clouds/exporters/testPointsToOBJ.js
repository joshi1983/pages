import { createTestDrawingWith3DPointCloud } from '../../../../helpers/createTestDrawingWith3DPointCloud.js';
import { drawingToPoints } from
'../../../../../modules/drawing-menu/download/point-clouds/drawingToPoints.js';
import { pointsToOBJ } from
'../../../../../modules/drawing-menu/download/point-clouds/exporters/pointsToOBJ.js';

export function testPointsToOBJ(logger) {
	const drawing = createTestDrawingWith3DPointCloud();
	const cloudPoints = drawingToPoints(drawing);
	for (const includeColour of [false, true]) {
		let fileContent = pointsToOBJ(cloudPoints, includeColour);
		if (typeof fileContent !== 'string')
			logger(`Expected a string but got ${fileContent}`);
	}
};