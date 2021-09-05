import { createTestDrawingWith3DPointCloud } from '../../../../helpers/createTestDrawingWith3DPointCloud.js';
import { drawingToPoints } from
'../../../../../modules/drawing-menu/download/point-clouds/drawingToPoints.js';
import { pointsToCSV } from
'../../../../../modules/drawing-menu/download/point-clouds/exporters/pointsToCSV.js';

export function testPointsToCSV(logger) {
	const drawing = createTestDrawingWith3DPointCloud();
	const cloudPoints = drawingToPoints(drawing);
	let fileContent = pointsToCSV(cloudPoints);
	if (typeof fileContent !== 'string')
		logger(`Expected a string but got ${fileContent}`);
};