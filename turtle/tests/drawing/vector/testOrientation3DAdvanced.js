import { equalWithinThreshold } from '../../../modules/equalWithinThreshold.js';
import { Orientation3D } from '../../../modules/drawing/vector/Orientation3D.js';
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testClone(logger) {
	const orientation = new Orientation3D();
	const clonedResult = orientation.clone();
	if (clonedResult.cachedHeadingRadians !== 0)
		logger(`Expected cachedHeadingRadians to be 0 but got ${clonedResult.cachedHeadingRadians}`);
	if (clonedResult.cachedPitchRadians !== 0)
		logger(`Expected cachedPitchRadians to be 0 but got ${clonedResult.cachedPitchRadians}`);
	if (clonedResult.cachedRollRadians !== 0)
		logger(`Expected cachedRollRadians to be 0 but got ${clonedResult.cachedRollRadians}`);
}

function testReset(logger) {
	const orientation = new Orientation3D();
	if (!orientation.isInitial())
		logger(`Expected isInitial() to return true to start with but got ${orientation.isInitial()}`);
	orientation.right(0.1);
	if (orientation.isInitial())
		logger(`Expected isInitial() to return false after calling right(0.1) but got ${orientation.isInitial()}`);
	orientation.reset();
	if (!orientation.isInitial())
		logger(`Expected isInitial() to return true after calling reset() but got ${orientation.isInitial()}`);
	const heading = orientation.getHeadingRadians();
	if (heading !== 0)
		logger(`Expected a heading of 0 after calling reset() but found ${heading}`);
	const pitch = orientation.getPitchRadians();
	if (pitch !== 0)
		logger(`Expected a pitch of 0 after calling reset() but found ${pitch}`);
}

function testPitchUp(logger) {
	const orientation = new Orientation3D();
	orientation.pitchUp(0);
	let heading = orientation.getHeadingRadians();
	if (heading !== 0)
		logger(`Expected a heading of 0 after calling pitchUp(0) but found ${heading}`);
	orientation.pitchUp(0.1);
	const newPitch = orientation.getPitchRadians();
	if (!equalWithinThreshold(newPitch, 0.1, 0.0000001))
		logger(`Expected a pitch of 0.1 after calling pitchUp(0.1) but found ${newPitch}`);
}

function testRight(logger) {
	const orientation = new Orientation3D();
	orientation.right(0);
	let heading = orientation.getHeadingRadians();
	if (heading !== 0)
		logger(`Expected a heading of 0 after calling right(0) but found ${heading}`);
	orientation.right(0.1);
	heading = orientation.getHeadingRadians();
	if (!equalWithinThreshold(heading, 0.1, 0.0000001))
		logger(`Expected a heading of 0.1 after calling right(0.1) but found ${heading}`);
}

function testRollRight(logger) {
	const orientation = new Orientation3D();
	orientation.rollRight(0);
	let heading = orientation.getHeadingRadians();
	if (heading !== 0)
		logger(`Expected a heading of 0 after calling right(0) but found ${heading}`);
	orientation.rollRight(0.1);
	const newRoll = orientation.getRollRadians();
	if (!equalWithinThreshold(newRoll, 0.1, 0.0000001))
		logger(`Expected a roll of 0.1 after calling rollRight(0.1) but found ${newRoll}`);
}

function testRotate(logger) {
	const orientation = new Orientation3D();
	const v1 = new Vector3D(1, 2, 3);
	const v = orientation.rotate(v1);
	if (!(v instanceof Vector3D))
		logger(`Expected rotate to return a Vector3D but got ${v}`);
	else {
		if (v.getX() !== 1)
			logger(`Expected v.getX() to return 1 but got ${v.getX()}`);
		if (v.getY() !== 2)
			logger(`Expected v.getY() to return 2 but got ${v.getY()}`);
		if (v.getZ() !== 3)
			logger(`Expected v.getZ() to return 3 but got ${v.getZ()}`);
	}
	orientation.right(Math.PI / 2);
	const v2 = orientation.rotate(v1);
	if (!(v2 instanceof Vector3D))
		logger(`After calling right, expected rotate to return a Vector3D but got ${v2}`);
	else {
		if (v2.getX() !== 2)
			logger(`Expected v2.getX() to return 2 but got ${v2.getX()}`);
		if (!equalWithinThreshold(v2.getY(), -1, 0.00001))
			logger(`Expected v2.getY() to return -1 but got ${v2.getY()}`);
		if (v2.getZ() !== 3)
			logger(`Expected v2.getZ() to return 3 but got ${v2.getZ()}`);
	}
}

function testSetHeadingRadians(logger) {
	const orientation = new Orientation3D();
	orientation.setHeadingRadians(0.1);
	let newHeading = orientation.getHeadingRadians();
	if (!equalWithinThreshold(newHeading, 0.1, 0.0000001))
		logger(`Expected a heading of 0.1 after calling setHeadingRadians(0.1) but found ${newHeading}`);
	orientation.setHeadingRadians(0.2);
	newHeading = orientation.getHeadingRadians();
	if (!equalWithinThreshold(newHeading, 0.2, 0.0000001))
		logger(`Expected a heading of 0.2 after calling setHeadingRadians(0.2) but found ${newHeading}`);
}

function testSetPitchRadians(logger) {
	const orientation = new Orientation3D();
	orientation.setPitchRadians(0.1);
	let newPitch = orientation.getPitchRadians();
	if (!equalWithinThreshold(newPitch, 0.1, 0.0000001))
		logger(`Expected a pitch of 0.1 after calling setPitchRadians(0.1) but found ${newPitch}`);
	orientation.setPitchRadians(0.2);
	newPitch = orientation.getPitchRadians();
	if (!equalWithinThreshold(newPitch, 0.2, 0.0000001))
		logger(`Expected a pitch of 0.2 after calling setPitchRadians(0.2) but found ${newPitch}`);
}

function testSetRollRadians(logger) {
	const orientation = new Orientation3D();
	orientation.setRollRadians(0.1);
	let newRoll = orientation.getRollRadians();
	if (!equalWithinThreshold(newRoll, 0.1, 0.0000001))
		logger(`Expected a roll of 0.1 after calling setRollRadians(0.1) but found ${newRoll}`);
	orientation.setRollRadians(0.2);
	newRoll = orientation.getRollRadians();
	if (!equalWithinThreshold(newRoll, 0.2, 0.0000001))
		logger(`Expected a roll of 0.2 after calling setRollRadians(0.2) but found ${newRoll}`);
}

export function testOrientation3DAdvanced(logger) {
	wrapAndCall([
		testClone,
		testPitchUp,
		testReset,
		testRight,
		testRollRight,
		testRotate,
		testSetHeadingRadians,
		testSetPitchRadians,
		testSetRollRadians
	], logger);
};