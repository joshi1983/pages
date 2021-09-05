import { equalWithinThreshold } from '../../../modules/equalWithinThreshold.js';
import { isCloseEnough } from '../../helpers/isCloseEnough.js';
import { Orientation3D } from '../../../modules/drawing/vector/Orientation3D.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testConstructor(logger) {
	const orientation = new Orientation3D();
	if (orientation.getRollRadians() !== 0)
		logger(`Expected getRollRadians() to return 0 but got ${orientation.getRollRadians()}`);

	orientation.setPitchRadians(1);
	orientation.setHeadingRadians(2);
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
	const orientation = new Orientation3D();
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
	testAngles.forEach(function(angle, index) {
		const plogger = prefixWrapper(`Test angle ${angle}, index ${index}`, logger);
		orientation.setHeadingRadians(angle);
		if (orientation.getHeadingRadians() !== angle)
			plogger(`Expected heading to be ${angle} but got ${orientation.getHeadingRadians()}`);
		orientation.setPitchRadians(angle);
		if (index === 0 && !equalWithinThreshold(orientation.getPitchRadians(), angle, 0.00001))
			plogger(`Expected pitch to be ${angle} but got ${orientation.getPitchRadians()}`);
		orientation.setRollRadians(angle);
		if (!equalWithinThreshold(orientation.getRollRadians(), angle, 0.00001))
			plogger(`Expected roll to be ${angle} but got ${orientation.getRollRadians()}`);
	});
}

export function testOrientation3D(logger) {
	wrapAndCall([
		testConstructor,
		testVariousMethodsBasic
	], logger);
};