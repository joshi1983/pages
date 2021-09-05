import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { Camera } from '../../../../modules/drawing/vector/Camera.js';
import { LineCap } from '../../../../modules/drawing/vector/shapes/style/LineCap.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector2D } from '../../../../modules/drawing/vector/Vector2D.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

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

function compareWithinThreshold(vObject, vector3D, logger, threshold) {
	if (!(vector3D instanceof Vector3D))
		throw new Error(`vector3D expected to be a Vector3D but got ${vector3D}`);
	if (threshold === undefined)
		threshold = 0.001;
	if (Math.abs(vObject.x - vector3D.getX()) > threshold)
		logger(`Expected x to be ${vObject.x} but got ${vector3D.getX()}`);
	if (Math.abs(vObject.y - vector3D.getY()) > threshold)
		logger(`Expected y to be ${vObject.y} but got ${vector3D.getY()}`);
	if (Math.abs(vObject.z - vector3D.getZ()) > threshold)
		logger(`Expected z to be ${vObject.z} but got ${vector3D.getZ()}`);
}

function testBoundingBox(logger) {
	/*
	If any of these tests fail, check:
	http://localhost:9001/turtle/prototypes/arc-bounding-box.html
	for interactive testing with different ArcShape properties and seeing what gets drawn.
	*/
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
		}},
		{'radius': 100, 'angle': -Math.PI / 2, 'rotation': 0, 'penWidth': 0, 'threshold': 0.1, 'result': {
			'max': {
				'x': 100,
				'y': 0,
				'z': 0.00001
			},
			'min': {
				'x': 0,
				'y': -100,
				'z': -0.00001
			}
		}},
		{'radius': 100, 'angle': -Math.PI, 'rotation': 0, 'penWidth': 0, 'threshold': 1.5, 'result': {
			'max': {
				'x': 100,
				'y': 100,
				'z': 0.00001
			},
			'min': {
				'x': 0,
				'y': -101,
				'z': -0.00001
			}
		}},
		{'radius': 100, 'angle': Math.PI, 'rotation': 0, 'penWidth': 2, 'threshold': 1.5, 'result': {
			'max': {
				'x': 1,
				'y': 101,
				'z': 0.00001
			},
			'min': {
				'x': -101,
				'y': -101,
				'z': -0.00001
			}
		}},
		{'radius': 100, 'angle': Math.PI, 'rotation': Math.PI * 3 / 2, 'penWidth': 0, 'threshold': 1.5, 'result': {
			'max': {
				'x': 100,
				'y': 1,
				'z': 0.00001
			},
			'min': {
				'x': -100,
				'y': -100,
				'z': -0.00001
			}
		}},
		{'radius': 100, 'angle': Math.PI * 2, 'rotation': 0, 'penWidth': 0, 'threshold': 0.5, 'result': {
			'max': {
				'x': 100,
				'y': 100,
				'z': 0.00001
			},
			'min': {
				'x': -100,
				'y': -100,
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
		if (caseInfo.threshold !== undefined) {
			compareWithinThreshold(caseInfo.result.min, box.min, plogger, caseInfo.threshold);
			compareWithinThreshold(caseInfo.result.max, box.max, plogger, caseInfo.threshold);
		}
	});
}

function testIsVisible(logger) {
	const cases = [
		{'angle': 0, 'lineCap': LineCap.Butt, 'result': false},
		{'angle': Math.PI * 0.5, 'lineCap': LineCap.Butt, 'result': true},
		{'angle': 0, 'lineCap': LineCap.Round, 'result': true},
		{'angle': Math.PI, 'lineCap': LineCap.Round, 'penWidth': 0, 'result': false}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const style = new ShapeStyle();
		if (caseInfo.lineCap !== undefined)
			style.setLineCap(caseInfo.lineCap);
		if (caseInfo.penWidth !== undefined)
			style.setPenWidth(caseInfo.penWidth);
		let rotationRadians = 0;
		let radius = 10;
		let angle = 0;
		if (caseInfo.angle !== undefined)
			angle = caseInfo.angle;
		const shape = new ArcShape(new Vector3D(0, 0, 0), rotationRadians, radius, angle, style);
		const result = shape.isVisible();
		if (result !== caseInfo.result)
			plogger(`Expected ${caseInfo.result} but got ${result}`);
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
	wrapAndCall([
		testBasics,
		testBoundingBox,
		testIsVisible,
		testSwapArcDirection
	], logger);
};