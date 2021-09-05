import { Orientation2D } from '../../../modules/drawing/vector/Orientation2D.js';
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testConstructor(logger) {
	let orientation = new Orientation2D();
	if (orientation.headingRadians !== 0)
		logger('In default constructor case, expected headingRadians initialized to 0 but got ' + orientation.headingRadians);
	orientation = new Orientation2D(1);
	if (orientation.headingRadians !== 1)
		logger('When passing 1 to constructor, expected headingRadians initialized to 1 but got ' + orientation.headingRadians);
	orientation = new Orientation2D(new Orientation2D(1));
	if (orientation.headingRadians !== 1)
		logger('When passing another Orientation2D to constructor, expected headingRadians initialized to 1(copied from other orientation) but got ' + orientation.headingRadians);

	const clone = orientation.clone();
	orientation.setHeadingRadians(0);
	if (clone.getHeadingRadians() !== 1)
		logger('expected cloned orientation heading to be 1 but got ' + clone.headingRadians);
}

function testRotate(logger) {
	const cases = [
		{
			'angle': 0,
			'vectorCases': [
				[[1, 0, 0], [1, 0, 0]],
				[[0, 1, 0], [0, 1, 0]],
				[[0.5, 0.5, 0], [0.5, 0.5, 0]]
			]
		},
		{
			'angle': Math.PI * 0.5,
			'vectorCases': [
				[[1, 0, 0], [0, -1, 0]],
				[[0, 1, 0], [1, 0, 0]]
			]
		}
	];
	cases.forEach(function(caseInfo, index) {
		const orientation = new Orientation2D();
		orientation.setHeadingRadians(caseInfo.angle);
		caseInfo.vectorCases.forEach(function(vectors, vIndex) {
			const result = orientation.rotate(new Vector3D(vectors[0]));
			const expected = new Vector3D(vectors[1]);
			if (!result.equalsCloseEnough(expected))
				logger(`Case ${index}, vector pair case ${vIndex}, Expected ${expected} but got ${result}`);
		});
	});
}

export function testOrientation2D(logger) {
	wrapAndCall([
		testConstructor,
		testRotate
	], logger);
};