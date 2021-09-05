import { createTestDrawingWith3DPointCloud } from
'../../../helpers/createTestDrawingWith3DPointCloud.js';
import { drawingToPoints } from
'../../../../modules/drawing-menu/download/point-clouds/drawingToPoints.js';
import { PointCloudPoint } from
'../../../../modules/drawing-menu/download/point-clouds/PointCloudPoint.js';

export function testDrawingToPoints(logger) {
	const drawing = createTestDrawingWith3DPointCloud();
	const result = drawingToPoints(drawing);
	if (!(result instanceof Array))
		logger(`Expected an Array but got ${result}`);
	else {
		result.forEach(function(point, index) {
			if (!(point instanceof PointCloudPoint))
				logger(`Expected every element in the result to be a PointCloudPoint but found ${point} at index ${index}}`);
		});
	}
};