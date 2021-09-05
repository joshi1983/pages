import { isCloseEnough } from '../../helpers/isCloseEnough.js';
import { Orientation } from '../../../modules/drawing/vector/Orientation.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js';

function testConstructor(logger) {
	const orientation = new Orientation(0, 1, 2);
	if (orientation.getRollRadians() !== 0)
		logger(`Expected getRollRadians() to return 0 but got ${orientation.getRollRadians()}`);
	if (orientation.getPitchRadians() !== 1)
		logger(`Expected getPitchRadians() to return 1 but got ${orientation.getPitchRadians()}`);
	if (orientation.getHeadingRadians() !== 2)
		logger(`Expected getHeadingRadians() to return 2 but got ${orientation.getHeadingRadians()}`);

	const clone = orientation.clone();

	// mutate orientation to check that the clone is deeply enough cloned to not also get mutated.
	orientation.setRollRadians(0);
	orientation.setHeadingRadians(0);
	orientation.setPitchRadians(0);

	if (clone.getRollRadians() !== 0)
		logger(`Expected getRollRadians() to return 0 but got ${clone.getRollRadians()}`);
	if (clone.getPitchRadians() !== 1)
		logger(`Expected getPitchRadians() to return 1 but got ${clone.getPitchRadians()}`);
	if (clone.getHeadingRadians() !== 2)
		logger(`Expected getHeadingRadians() to return 2 but got ${clone.getHeadingRadians()}`);
}

function testVariousMethodsBasic(logger) {
	const orientation = new Orientation();
	if (orientation.getHeadingRadians() !== 0)
		logger(`Expected getHeadingRadians() to return 0 but got ${orientation.getHeadingRadians()}`);
	if (orientation.getPitchRadians() !== 0)
		logger(`Expected getPitchRadians() to return 0 but got ${orientation.getPitchRadians()}`);
	if (orientation.getRollRadians() !== 0)
		logger(`Expected getRollRadians() to return 0 but got ${orientation.getRollRadians()}`);
	const v = new Vector3D(1, 2, 3);
	const rotatedV = orientation.rotate(v);
	if (rotatedV.getX() !== 1)
		logger(`Expected getX() to return 1 but got ${rotatedV.getX()}`);
	if (rotatedV.getY() !== 2)
		logger(`Expected getY() to return 2 but got ${rotatedV.getY()}`);
	if (rotatedV.getZ() !== 3)
		logger(`Expected getZ() to return 3 but got ${rotatedV.getZ()}`);
	const testAngles = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
	testAngles.forEach(function(angle) {
		orientation.setHeadingRadians(angle);
		if (orientation.getHeadingRadians() !== angle)
			logger(`Expected heading to be ${angle} but got ${orientation.getHeadingRadians()}`);
		orientation.setPitchRadians(angle);
		if (orientation.getPitchRadians() !== angle)
			logger(`Expected pitch to be ${angle} but got ${orientation.getPitchRadians()}`);
		orientation.setRollRadians(angle);
		if (orientation.getRollRadians() !== angle)
			logger(`Expected roll to be ${angle} but got ${orientation.getRollRadians()}`);
	});
}

export function testOrientation(logger) {
	testConstructor(prefixWrapper('testConstructor', logger));
	testVariousMethodsBasic(prefixWrapper('testVariousMethodsBasic', logger));
};