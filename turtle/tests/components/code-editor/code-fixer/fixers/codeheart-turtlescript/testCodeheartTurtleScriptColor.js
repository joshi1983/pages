import { CodeheartTurtleScriptColor } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/codeheart-turtlescript/CodeheartTurtleScriptColor.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

function testIsUniqueToCodeheartTurtleScript(logger) {
	const cases = [
	{'in': 'RED', 'out': false},
	{'in': 'BABY_BLUE', 'out': true},
	{'in': 'YELLOW', 'out': true},
	];
	testInOutPairs(cases, CodeheartTurtleScriptColor.isUniqueToCodeheartTurtleScript, logger);
}

function testNameToHex(logger) {
	const hex = CodeheartTurtleScriptColor.nameToHex('GOLD');
	if (hex !== '#f0cb1d')
		logger(`Expected #f0cb1d but got ${hex}`);
}

export function testCodeheartTurtleScriptColor(logger) {
	wrapAndCall([
		testIsUniqueToCodeheartTurtleScript,
		testNameToHex
	], logger);
};