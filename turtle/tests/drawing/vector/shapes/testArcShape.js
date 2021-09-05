import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { Camera } from '../../../../modules/drawing/vector/Camera.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector2D } from '../../../../modules/drawing/vector/Vector2D.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

function testBasics(logger) {
	const a = new ArcShape(new Vector2D(), 0, 10, Math.PI);
	a.clone();
	if (a.rotationRadians !== 0)
		logger('Expected rotationRadians of 0 but got ' + c.rotationRadians);
	if (a.radius !== 10)
		logger('Expected radius of 10 but got ' + c.radius);
	if (a.angle !== Math.PI)
		logger('Expected angle of ' + Math.PI + ' but got ' + a.angle);
	new ArcShape(new Vector3D(), 0, 10, Math.PI);
	new ArcShape(new Vector3D(), 0, 10, Math.PI, new ShapeStyle());
	const scaledArc = a.transformBy(new Camera({'zoomScale': 5}));
	if (scaledArc.radius !== 50)
		logger('Expected scaled radius to be 50 but got ' + scaledArc.radius);
	if (scaledArc.angle !== Math.PI)
		logger('Expected scaled angle to stay at ' + Math.PI + ' but got ' + scaledArc.angle);
	if (scaledArc.rotationRadians !== 0)
		logger('Expected scaled rotationRadians to stay at 0 but got ' + scaledArc.rotationRadians);

	scaledArc.getBoundingBox();
	scaledArc.swapArcDirection();
}

function testBoundingBox(logger) {
	const cases = [
		{'radius': 100, 'angle': 0.0000001, 'rotation': 0, 'penWidth': 1, 'result': {
			'max': {
				'x': 2,
				'y': -98,
				'z': 0.00001
			},
			'min': {
				'x': -2,
				'y': -102,
				'z': -0.00001
			}
		}}
	];
	cases.forEach(function(caseInfo, index) {
		const style = new ShapeStyle();
		style.setPenWidth(caseInfo.penWidth);
		const arc = new ArcShape(new Vector3D(), caseInfo.rotation, caseInfo.radius, caseInfo.angle, style);
		const box = arc.getBoundingBox();
		const plogger = prefixWrapper('Case ' + index, logger);
		if (box.max.getZ() > caseInfo.result.max.z)
			plogger('Expected max z to be no larger than ' + caseInfo.result.max.z + ' but got a max z of ' + box.max.getZ());
		if (box.max.getY() > caseInfo.result.max.y)
			plogger('Expected max y to be no larger than ' + caseInfo.result.max.y + ' but got a max y of ' + box.max.getY());
		if (box.max.getX() > caseInfo.result.max.x)
			plogger('Expected max x to be no larger than ' + caseInfo.result.max.x + ' but got a max x of ' + box.max.getX());
	});
}

function testSwapArcDirection(logger) {
	const a = new ArcShape(new Vector2D(), 0, 10, Math.PI);
	const p1 = new Vector3D(a.getStartPoint().coords.slice(0));
	const p2 = new Vector3D(a.getEndPoint().coords.slice(0));
	a.swapArcDirection();
	const p3 = new Vector3D(a.getStartPoint().coords.slice(0));
	const p4 = new Vector3D(a.getEndPoint().coords.slice(0));
	if (!p3.equalsCloseEnough(p2))
		logger('Expected start point to be ' + p2 + ' but got ' + p3);
	if (!p4.equalsCloseEnough(p1))
		logger('Expected start point to be ' + p1 + ' but got ' + p4);
}

export function testArcShape(logger) {
	testBasics(prefixWrapper('testBasics', logger));
	testBoundingBox(prefixWrapper('testBoundingBox', logger));
	testSwapArcDirection(prefixWrapper('testSwapArcDirection', logger));
};