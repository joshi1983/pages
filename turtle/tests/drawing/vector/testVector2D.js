import { Vector2D } from '../../../modules/drawing/vector/Vector2D.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testConstructor(logger) {
	const cases = [
		{'in': [], 'coords': [0, 0]},
		{'in': [1, 2], 'coords': [1, 2]},
		{'in': [[1, 2]], 'coords': [1, 2]},
		{'in': [new Vector2D()], 'coords': [0, 0]},
		{'in': [new Vector2D(1, 2)], 'coords': [1, 2]},
		{'in': [0], 'error': true},
		{'in': ['hi'], 'error': true},
		{'in': [0, 'hi'], 'error': true}
	];
	cases.forEach(function(caseInfo) {
		try {
			const v = new Vector2D(...caseInfo.in);
			for (let i = 0; i < 2; i++) {
				if (v.coords[i] !== caseInfo.coords[i])
					logger('Expected ' + caseInfo[i] + ' at index ' + i + ' but got ' + v.coords[i]);
			}
		}
		catch (e) {
			if (!caseInfo.error)
				logger('Unexpected error thrown for inputs: ' + JSON.stringify(caseInfo.in));
		}
	});
}

function testCopyConstructor(logger) {
	const v = new Vector2D();
	v.setX(1);
	v.setY(2);
	const v2 = new Vector2D(v);
	v2.setX(8);
	v2.setY(7);
	if (v.getX() !== 1)
		logger('Expected v\'s x to be 1 but got ' + v.getX());
	if (v.getY() !== 2)
		logger('Expected v\'s y to be 2 but got ' + v.getY());
	if (v2.getX() !== 8)
		logger('v2\'s x expected to be 8 but got ' + v2.getX());
}

function testMethods(logger) {
	const v = new Vector2D();
	if (v.magnitude() !== 0)
		logger('Expected magnitude of 0 but got ' + v.magnitude());
	if (v.getX() !== 0)
		logger('Expected an x value of 0 but got ' + v.getX());
	if (v.getY() !== 0)
		logger('Expected an y value of 0 but got ' + v.getY());
	if (JSON.stringify(v.toArray()) !== '[0,0]')
		logger('Expected [0,0] from toArray() but got ' + JSON.stringify(v.toArray()));
	v.setX(1);
	if (v.getX() !== 1)
		logger('Expected an x value of 1 but got ' + v.getX());
	if (v.magnitude() !== 1)
		logger('Expected magnitude of 1 but got ' + v.magnitude());
	v.setY(1);
	if (v.getY() !== 1)
		logger('Expected an y value of 1 but got ' + v.getY());
	if (Math.abs(v.magnitude() - Math.sqrt(2)) > 0.0001)
		logger('Expected magnitude of square root 2 but got ' + v.magnitude());
	const v2 = v.plus([-1, -2]);
	if (v2.getX() !== 0)
		logger('x expected to be 0 but got ' + v2.getX());
	if (v2.getY() !== -1)
		logger('y expected to be -1 but got ' + v2.getY());
	
	const v3 = v2.minus([-1, -2]);
	if (v3.getX() !== 1)
		logger('x expected to be 1 but got ' + v3.getX());
	if (v3.getY() !== 1)
		logger('y expected to be 1 but got ' + v3.getY());

	v3.setX(0);
	if (v3.getX() !== 0)
		logger('x expected to be 0 but got ' + v3.getX());
	v3.setY(0);
	if (v3.getY() !== 0)
		logger('y expected to be 0 but got ' + v3.getY());
	
	v3.getDisplacedByPolar(0, 5); // should not mutate state at all but just return a new value.
	if (v3.getX() !== 0)
		logger('After getting displaced value, x expected to be 0 but got ' + v3.getX());
	if (v3.getY() !== 0)
		logger('After getting displaced value, y expected to be 0 but got ' + v3.getY());
}

function testTransformations(logger) {
	const v = new Vector2D();
	v.minus(new Vector2D());
	v.plus(new Vector2D());
	v.multiply(4);
	if (!v.equals(new Vector2D(0, 0)))
		logger('v expected to be [0, 0] but got ' + v);
}

export function testVector2D(logger) {
	wrapAndCall([
		testConstructor,
		testCopyConstructor,
		testMethods,
		testTransformations
	], logger);
};