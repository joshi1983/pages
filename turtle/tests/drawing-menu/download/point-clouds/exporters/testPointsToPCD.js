import { createTestDrawingWith3DPointCloud } from '../../../../helpers/createTestDrawingWith3DPointCloud.js';
import { drawingToPoints } from
'../../../../../modules/drawing-menu/download/point-clouds/drawingToPoints.js';
import { pointsToPCD } from
'../../../../../modules/drawing-menu/download/point-clouds/exporters/pointsToPCD.js';

export function testPointsToPCD(logger) {
	const drawing = createTestDrawingWith3DPointCloud();
	const cloudPoints = drawingToPoints(drawing);
	let fileContent = pointsToPCD(cloudPoints);
	if (typeof fileContent !== 'string')
		logger(`Expected a string but got ${fileContent}`);
};