import { isCloseEnough } from '../../helpers/isCloseEnough.js';
import { Matrix3D } from '../../../modules/drawing/vector/Matrix3D.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js';

function testIdentityCase(logger) {
	const m = new Matrix3D();
	if (!(m instanceof Matrix3D))
		logger('m expected to be an instanceof Matrix3D but got: ' + m);
	const v = new Vector3D(1, 2, 3);
	const result = Matrix3D.multiplyWithVector(m, v);
	if (!(result instanceof Vector3D))
		logger('Expected a Vector3D but got: ' + result);
	else {
		if (result.getX() !== 1)
			logger(`Expected x to be 1 but got ${result.getX()}`);
		if (result.getY() !== 2)
			logger(`Expected y to be 2 but got ${result.getY()}`);
		if (result.getZ() !== 3)
			logger(`Expected z to be 3 but got ${result.getZ()}`);
	}
}

function testRotationMatrix(logger) {
	const cases = [
		{
			'in': [0, 0, 0],
			'out': [
				[1, 0, 0], 
				[0, 1, 0],
				[0, 0, 1]
			]
		},
		{
			'in': [0, 0, Math.PI * 0.5],
			'out': [
				[0, -1, 0],
				[1, 0, 0],
				[0, 0, 1]
			]
		},
		{
			'in': [0.5, 1, 1.5]
			// check if it returns anything.
		}
	];
	cases.forEach(function(caseInfo) {
		const result = Matrix3D.createFromRotations(...caseInfo.in);
		if (!(result instanceof Array))
			logger('Expected an Array but got ' + result);
		else if (result.length !== 3)
			logger(`Expected length to be 3 but got ${result.length}`);
		else if (result[0].length !== 3)
			logger(`Expected result[0] to have length 3 but got ${result[0].length}`);
		else if (caseInfo.out !== undefined) {
			if (!isCloseEnough(result, caseInfo.out))
				logger(`Expected ${caseInfo.out} but got ${result}`);
		}
	});
}

export function testMatrix3D(logger) {
	testIdentityCase(prefixWrapper('testIdentityCase', logger));
	testRotationMatrix(prefixWrapper('testRotationMatrix', logger));
};