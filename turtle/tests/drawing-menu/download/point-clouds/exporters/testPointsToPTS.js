import { createTestDrawingWith3DPointCloud } from '../../../../helpers/createTestDrawingWith3DPointCloud.js';
import { drawingToPoints } from
'../../../../../modules/drawing-menu/download/point-clouds/drawingToPoints.js';
import { pointsToPTS } from
'../../../../../modules/drawing-menu/download/point-clouds/exporters/pointsToPTS.js';

export function testPointsToPTS(logger) {
	const drawing = createTestDrawingWith3DPointCloud();
	const cloudPoints = drawingToPoints(drawing);
	let fileContent = pointsToPTS(cloudPoints);
	if (typeof fileContent !== 'string')
		logger(`Expected a string but got ${fileContent}`);
};