import { asyncInit } from '../../../../../modules/parsing/python-parsing/parse.js';
import { getCachedParseTreeFromPythonCode } from '../../../../helpers/parsing/getCachedParseTreeFromPythonCode.js';
import { isDependingOnColorMode } from '../../../../../modules/parsing/python-parsing/parse-tree-analysis/procedure-dependencies/isDependingOnColorMode.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';

function mockIsDependingOnColorMode(code) {
	const cachedTree = getCachedParseTreeFromPythonCode(code);
	return isDependingOnColorMode(cachedTree);
}

export async function testIsDependingOnColorMode(logger) {
	await asyncInit();
	const cases = [
		{'in': '', 'out': false},
		{'in': 'x = [1,2,3]', 'out': false},
		{'in': 'pencolor()', 'out': false},
		{'in': 'pencolor("red")', 'out': false},
		{'in': 'pencolor(0.1, 0.2, 0.9)', 'out': true},
		{'in': 'pencolor([0.1, 0.2, 0.9])', 'out': true},
		{'in': 'pencolor( (0.1, 0.2, 0.9) )', 'out': true},
		{'in': 'x = [2,3, 4]\npencolor(x)', 'out': true}
	];
	testInOutPairs(cases, mockIsDependingOnColorMode, logger);
};