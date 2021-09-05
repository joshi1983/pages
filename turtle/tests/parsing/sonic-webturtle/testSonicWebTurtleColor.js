import { SonicWebTurtleColor } from
'../../../modules/parsing/sonic-webturtle/SonicWebTurtleColor.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testIsUniqueToSonicWebTurtle(logger) {
	const cases = [
	{'in': 'RED', 'out': false},
	{'in': 'GREEN', 'out': true},
	];
	testInOutPairs(cases, SonicWebTurtleColor.isUniqueToSonicWebTurtle, logger);
}

function testNameToHex(logger) {
	const hex = SonicWebTurtleColor.nameToHex('purple');
	if (hex !== '#ff00ff')
		logger(`Expected #ff00ff but got ${hex}`);
}

export function testSonicWebTurtleColor(logger) {
	wrapAndCall([
		testIsUniqueToSonicWebTurtle,
		testNameToHex
	], logger);
};