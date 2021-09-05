import { isCloseEnough } from '../../helpers/isCloseEnough.js';
import { Orientation3D } from '../../../modules/drawing/vector/Orientation3D.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

/*
All test cases are based on behaviour of FMSLogo so the pitch, roll, and 
heading causes vectors to be rotated the same way they are rotated in FMS Logo.
"perspective" is run before all testing in FMSLogo 
because that changes how roll and pitch are processed.
*/

function compareVectorLogged(v, coords, logger) {
	for (let i = 0; i < 3; i++) {
		if (!isCloseEnough(coords[i], v.coords[i]))
			logger(`Expected ${coords[i]} for ${'xyz'[i]} but got ${v.coords[i]}`);
	}
}

function processTestCase(setMethod, caseInfo, logger) {
	const orientation = new Orientation3D();
	orientation[setMethod](caseInfo.angle);
	let v = new Vector3D(0, 1, 0);
	let result = orientation.rotate(v);
	const plogger = prefixWrapper(`Case ${caseInfo.index}`, logger);
	compareVectorLogged(result, caseInfo.yRotated, plogger);
	if (caseInfo.xRotated !== undefined) {
		v = new Vector3D(1, 0, 0);
		result = orientation.rotate(v);
		compareVectorLogged(result, caseInfo.xRotated, prefixWrapper('xRotated', plogger));
	}
}

function testHeadingAndPitchCombo(logger) {
	const cases = [
		{
			'heading': 0,
			'pitch': 0,
			'rotated': [0, 1, 0]
		},
		{
			'heading': Math.PI * 0.5,
			'pitch': Math.PI * 0.5,
			'rotated': [0, 0, 1]
		},
		{
			'heading': Math.PI * 0.5,
			'pitch': Math.PI,
			'rotated': [-1, 0, 0]
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const orientation = new Orientation3D();
		orientation.setHeadingRadians(caseInfo.heading);
		orientation.setPitchRadians(caseInfo.pitch);
		const result = orientation.rotate(new Vector3D([0, 1, 0]));
		compareVectorLogged(result, caseInfo.rotated, plogger);
	});
}

function testHeadingAndRollCombo(logger) {
	const cases = [
		{
			'heading': 0,
			'roll': 0,
			'rotated': [0, 1, 0]
		},
		{
			'heading': Math.PI * 0.5,
			'roll': Math.PI * 0.5,
			'rotated': [1, 0, 0]
		},
		{
			'heading': Math.PI * 0.5,
			'roll': Math.PI,
			'rotated': [1, 0, 0]
		},
		{
			'heading': Math.PI * 0.5,
			'roll': Math.PI * 1.5,
			'rotated': [1, 0, 0]
		},
		{
			'heading': Math.PI,
			'roll': Math.PI,
			'rotated': [0, -1, 0]
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const orientation = new Orientation3D();
		orientation.setHeadingRadians(caseInfo.heading);
		orientation.setRollRadians(caseInfo.roll);
		const result = orientation.rotate(new Vector3D([0, 1, 0]));
		compareVectorLogged(result, caseInfo.rotated, plogger);
	});
}

function testHeadings(logger) {
	const cases = [
		{
			'angle': 0,
			'yRotated': [0, 1, 0],
			'xRotated': [1, 0, 0]
		},
		{
			'angle': Math.PI * 0.5,
			'yRotated': [1, 0, 0],
			'xRotated': [0, -1, 0]
		},
		{
			'angle': Math.PI,
			'yRotated': [0, -1, 0],
			'xRotated': [-1, 0, 0]
		},
		{
			'angle': Math.PI * 1.5,
			'yRotated': [-1, 0, 0],
			'xRotated': [0, 1, 0]
		}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase('setHeadingRadians', caseInfo, logger);
	});
}

function testPitchAndRollCombo(logger) {
	const cases = [
		{
			'pitch': 0,
			'roll': 0,
			'rotated': [0, 1, 0]
		},
		{
			'pitch': Math.PI,
			'roll': Math.PI,
			'rotated': [0, -1, 0]
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const orientation = new Orientation3D();
		orientation.setRollRadians(caseInfo.roll);
		orientation.setPitchRadians(caseInfo.pitch);
		const result = orientation.rotate(new Vector3D([0, 1, 0]));
		compareVectorLogged(result, caseInfo.rotated, plogger);
	});
}

function testPitches(logger) {
	const cases = [
		{
			'angle': 0,
			'yRotated': [0, 1, 0],
			'xRotated': [1, 0, 0]
		},
		{
			'angle': Math.PI * 0.5,
			'yRotated': [0, 0, 1],
			'xRotated': [1, 0, 0]
		},
		{
			'angle': Math.PI,
			'yRotated': [0, -1, 0]
		},
		{
			'angle': Math.PI * 1.5,
			'yRotated': [0, 0, -1]
		}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase('setPitchRadians', caseInfo, logger);
	});
}

function testRolls(logger) {
	const cases = [
		{
			'angle': 0,
			'yRotated': [0, 1, 0],
			'xRotated': [1, 0, 0]
		},
		{
			'angle': Math.PI * 0.5,
			'yRotated': [0, 1, 0]
		},
		{
			'angle': Math.PI,
			'yRotated': [0, 1, 0]
		},
		{
			'angle': Math.PI * 1.5,
			'yRotated': [0, 1, 0]
		}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase('setRollRadians', caseInfo, logger);
	});
}

export function testOrientationRotated(logger) {
	wrapAndCall([
		testHeadingAndPitchCombo,
		testHeadingAndRollCombo,
		testPitchAndRollCombo,
		testHeadings,
		testPitches,
		testRolls
	], logger);
};