import { getCachedParseTreeFromPythonCode } from
'../../../../helpers/parsing/getCachedParseTreeFromPythonCode.js';
import { isDependingOnPyCircle } from
'../../../../../modules/parsing/python-parsing/parse-tree-analysis/procedure-dependencies/isDependingOnPyCircle.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';

function codeToIsDependingOnPyCircle(code) {
	const tree = getCachedParseTreeFromPythonCode(code);
	return isDependingOnPyCircle(tree);
}

export async function testIsDependingOnPyCircle(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': 'turtle.forward(100)', 'out': false},
		{'in': 'turtle.circle(100)', 'out': false},
		{'in': 'turtle.circle(40, -180)', 'out': true},
	];
	testInOutPairs(cases, codeToIsDependingOnPyCircle, logger);
};