import { LineCap } from '../../../../modules/drawing/vector/shapes/style/LineCap.js';
import { LineSegmentShape } from '../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testBasics(logger) {
	const line = new LineSegmentShape(new Vector3D(4, 5, 0), new Vector3D(1, 2, 0), new ShapeStyle({'pen': {'lineCap': LineCap.Butt}}));
	line.clone();
	if (line.endPoint.getX() !== 1)
		logger('Expected x of 1 but got ' + line.endPoint.getX());
	if (line.endPoint.getY() !== 2)
		logger('Expected y of 2 but got ' + line.endPoint.getY());
	if (line.position.getX() !== 4)
		logger('Expected x of 4 but got ' + line.position.getX());
	if (line.position.getY() !== 5)
		logger('Expected y of 5 but got ' + line.position.getY());
	new LineSegmentShape(new Vector3D(), new Vector3D());
	new LineSegmentShape(new Vector3D(), new Vector3D(), new ShapeStyle());
	new LineSegmentShape(new Vector3D(), new Vector3D(), new ShapeStyle({'pen': {'lineCap': LineCap.Butt}}));

	const box = line.getBoundingBox();
	if (box.min.getY() < 0)
		logger('Expected box min y to be no less than 0 but got ' + box.min.getY());
	if (box.max.getY() > 6)
		logger('Expected box max y to be at most 6 but got ' + box.max.getY());
	if (box.max.getZ() > 0.0001)
		logger('Expected box max z to be at most 0 but got ' + box.max.getZ());
	if (box.min.getZ() < -0.0001)
		logger('Expected box min z to be at least ' + box.min.getZ());

	line.swapEndPoints();
}

function testSwapEndPoints(logger) {
	const p1 = new Vector3D(1, 2, 3);
	const p2 = new Vector3D(4, 5, 6);
	const line = new LineSegmentShape(p1, p2);
	if (!line.position.equals(p1))
		logger('Expected position to be ' + p1 + ' but got ' + line.position);
	if (!line.endPoint.equals(p2))
		logger('Expected endPoint to be ' + p2 + ' but got ' + line.endPoint);
	line.swapEndPoints();
	if (!line.position.equals(new Vector3D(4, 5, 6)))
		logger('After swap, expected position to be 4, 5, 6 but got ' + line.position);
	if (!line.endPoint.equals(new Vector3D(1, 2, 3)))
		logger('After swap, expected endPoint to be 1, 2, 3 but got ' + line.endPoint);
}

export function testLineSegmentShape(logger) {
	wrapAndCall([
		testBasics,
		testSwapEndPoints
	], logger);
};