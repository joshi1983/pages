import { equalWithinThreshold } from '../../../../modules/equalWithinThreshold.js';
import { LineCap } from '../../../../modules/drawing/vector/shapes/style/LineCap.js';
import { LineJoinStyle } from '../../../../modules/drawing/vector/shapes/style/LineJoinStyle.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testGeneralCases(logger) {
	const points = [
		new Vector3D(1, 2, 3),
		new Vector3D(5, 6, 7),
		new Vector3D(-9, -11, -13)
	];
	const p = new PathShape(points, false);
	const box = p.getBoundingBox();
	if (box.min.getX() > -9)
		logger('box min x expected to be at most -9 but got ' + box.min.getX());
	if (box.min.getY() > -11)
		logger('box min y expected to be at most -11 but got ' + box.min.getY());
	if (box.min.getZ() > -13)
		logger('box min z expected to be at most -13 but got ' + box.min.getZ());

	if (box.max.getX() < 5)
		logger('box max x expected to be at most 5 but got ' + box.max.getX());
	if (box.max.getY() < 6)
		logger('box max y expected to be at most 6 but got ' + box.max.getY());
	if (box.max.getZ() < 7)
		logger('box max z expected to be at most 7 but got ' + box.max.getZ());
	p.clone();
}

function testMiterJoinCases(logger) {
	const radius = 5;
	const cases = [
	{
		'angle': 0,
		'minX': -10 - radius * Math.cos(Math.PI / 4) - Math.cos(Math.PI / 4),
		'maxX': Math.cos(Math.PI / 4)
	},
	{
		'angle': 90,
		'minX': -10 - 1/Math.cos(Math.PI / 4),
		'maxX': Math.cos(Math.PI / 4)
	}
	];
	const points = [
	{'x': 0, 'y': 0}, {'x': -10, 'y': 10}
	];
	const errorThreshold = 0.000001;
	const style = new ShapeStyle();
	const isClosed = true;
	style.setLineJoinStyle(LineJoinStyle.Miter);
	style.setMiterLimit(100000); // make sure it should not use bevel joints even if the angle is close to 180.
	style.setPenWidth(2);
	style.setLineCap(LineCap.Butt);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const radianAngle = caseInfo.angle * Math.PI / 180 - Math.PI / 4;
		const newPoints = points.slice();
		const lastPoint = points[points.length - 1];
		newPoints.push({'x': lastPoint.x + radius * Math.sin(radianAngle), 'y': lastPoint.y + radius * Math.cos(radianAngle)});
		console.log(`newPoints = ${newPoints}, `, newPoints);
		console.log(`Expected minX = ${caseInfo.minX}`);
		const newVectors = newPoints.map(p => new Vector3D(p.x, p.y, 0));
		const path = new PathShape(newVectors, isClosed, style);
		const box = path.getBoundingBox();
		for (let key in caseInfo) {
			if (key.startsWith('min') || key.startsWith('max')) {
				let v;
				if (key.startsWith('min'))
					v = box.min;
				else
					v = box.max;
				const val = v['get' + key[key.length - 1]]();
				const expectedVal = caseInfo[key];
				if (!equalWithinThreshold(val, expectedVal, errorThreshold))
					plogger(`Expected ${expectedVal} but got ${val} for ${key}`);
			}
		}
	});
}

export function testPathShape(logger) {
	wrapAndCall([
		testGeneralCases,
		testMiterJoinCases
	], logger);
};