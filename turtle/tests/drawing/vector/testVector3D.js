import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { Vector2D } from '../../../modules/drawing/vector/Vector2D.js';
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js';
const errorThreshold = 0.00001;

function validateNumbers(a, logger) {
	for (let i = 0; i < 3; i++) {
		if (typeof a[i] !== 'number' || isNaN(a[i]))
			logger(`Not a number found at index ${i}.  Value = ${a[i]}`);
	}
}

function testCopyConstructor(logger) {
	const v = new Vector3D();
	v.setX(1);
	v.setY(2);
	v.setZ(3);
	const v2 = new Vector3D(v);
	v2.setX(8);
	v2.setY(7);
	v2.setZ(6);
	if (v.getX() !== 1)
		logger('Expected v\'s x to be 1 but got ' + v.getX());
	if (v.getY() !== 2)
		logger('Expected v\'s y to be 2 but got ' + v.getY());
	if (v.getZ() !== 3)
		logger('Expected v\'s z to be 3 but got ' + v.getZ());
	if (v2.getX() !== 8)
		logger('v2\'s x expected to be 8 but got ' + v2.getX());
	
	const v2d = new Vector2D(1, 2);
	const v3 = new Vector3D(v2d);
	v3.setX(9);
	v3.setY(10);
	if (v2d.getX() !== 1)
		logger('Expected v2d\'x to be 1 but got ' + v2d.getX());
	if (v2d.getY() !== 2)
		logger('Expected v2d\'y to be 2 but got ' + v2d.getY());
	if (v2d.coords.length !== 2)
		logger('Expected v2d\s coords to have length 2 but got ' + v2d.coords.length);
}

function testCross(logger) {
	/*
	This test case came from an example at:
	https://opentextbc.ca/calculusv3openstax/chapter/the-cross-product/
	*/
	const v1 = new Vector3D(-1, 2, 5);
	const v2 = new Vector3D(4, 0, -3);
	const result = Vector3D.cross(v1, v2);
	if (result.getX() !== -6)
		logger('x expected to be -6 but got ' + result.getX());
	if (result.getY() !== 17)
		logger('y expected to be 17 but got ' + result.getY());
	if (result.getZ() !== -8)
		logger('z expected to be -8 but got ' + result.getZ());
}

function testDisplacedByPolar(logger) {
	const v = new Vector3D();
	const displaced = v.getDisplacedByPolar(0, 1);
	if (displaced.getX() !== 1)
		logger('displaced x expected to be 1 but got ' + displaced.getX());
	if (displaced.getY() !== 0)
		logger('displaced y expected to be 0 but got ' + displaced.getY());
	const displaced2 = displaced.getDisplacedByPolar(Math.PI * 0.5, 2);
	if (Math.abs(displaced2.getX() - 1) > errorThreshold)
		logger('displaced2 x expected to be 1 but got ' + displaced2.getX());
	if (displaced2.getY() !== 2)
		logger('displaced2 y expected to be 2 but got ' + displaced2.getY());
}

function testMultiply(logger) {
	const v = new Vector3D();
	v.multiply(5);
	v.minus(new Vector3D());
}

function testPlus(logger) {
	const v = new Vector3D();
	v.plus(new Vector3D());
	validateNumbers(v.coords, prefixWrapper('plus Vector3D', logger));
	v.plus(new Vector2D());
	validateNumbers(v.coords, prefixWrapper('plus Vector2D', logger));
}

function testGetXYVector(logger) {
	const v = new Vector3D(1, 2, 3);
	const v2 = v.getXYVector();
	if (v2.getX() !== 1)
		logger('Expected x to be 1 but got ' + v2.getX());
	if (v2.getY() !== 2)
		logger('Expected y to be 2 but got ' + v2.getY());
}

export function testVector3D(logger) {
	testCopyConstructor(prefixWrapper('testCopyConstructor', logger));
	testCross(prefixWrapper('testCross', logger));
	testDisplacedByPolar(prefixWrapper('testDisplacedByPolar', logger));
	testGetXYVector(prefixWrapper('testGetXYVector', logger));
	testMultiply(prefixWrapper('testMultiply', logger));
	testPlus(prefixWrapper('testPlus', logger));
	const v = new Vector3D();
	if (JSON.stringify(v.toArray()) !== '[0,0,0]')
		logger('Expected [0,0,0] from toArray but got ' + JSON.stringify(v.toArray()));

	const v2d = new Vector2D(1,2);
	const v3d = new Vector3D(v2d);
	if (JSON.stringify(v3d.toArray()) !== '[1,2,0]')
		logger('After creating from Vector2D, expected [1,2,0] from toArray but got ' + JSON.stringify(v3d.toArray()));
};