import { PovRayColor } from '../../../modules/parsing/pov-ray/PovRayColor.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testIsUniqueToPovRay(logger) {
	const cases = [
	{'in': 'Red', 'out': false},
	{'in': 'Black', 'out': false},
	{'in': 'abcdef', 'out': false},
	{'in': 'Brass', 'out': true},
	// Brass isn't defined in WebLogo colours.
	{'in': 'brass', 'out': false},
	// POV-ray names are case sensitive.
	];
	testInOutPairs(cases, PovRayColor.isUniqueToPovRay, logger);
}

function testNameToHex(logger) {
	const colorName = 'Red';
	const hex = PovRayColor.nameToHex(colorName);
	if (typeof hex !== 'string')
		logger(`Expected hex string for ${colorName} but got ${hex}`);
}

export function testPovRayColor(logger) {
	wrapAndCall([
		testIsUniqueToPovRay,
		testNameToHex
	], logger);
};