import { createTestDrawingWith3DPointCloud } from '../../../../helpers/createTestDrawingWith3DPointCloud.js';
import { drawingToPoints } from
'../../../../../modules/drawing-menu/download/point-clouds/drawingToPoints.js';
import { pointsToPLY } from '../../../../../modules/drawing-menu/download/point-clouds/exporters/pointsToPLY.js';

export function testPointsToPLY(logger) {
	const drawing = createTestDrawingWith3DPointCloud();
	const cloudPoints = drawingToPoints(drawing);
	let fileContent = pointsToPLY(cloudPoints);
	if (typeof fileContent !== 'string')
		logger(`Expected a string but got ${fileContent}`);
};