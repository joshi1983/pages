import { getCachedParseTreeFromPythonCode } from '../../../../helpers/parsing/getCachedParseTreeFromPythonCode.js';
import { isDependingOnHeadingMode } from '../../../../../modules/parsing/python-parsing/parse-tree-analysis/procedure-dependencies/isDependingOnHeadingMode.js';
import { asyncInit } from '../../../../../modules/parsing/python-parsing/parse.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

export async function testIsDependingOnHeadingMode(logger) {
	await asyncInit();
	const cases = [
		{'in': '', 'out': false},
		{'in': 't.forward(100)', 'out': true},
		{'in': 't.radians()\nt.right(90)\nprint heading()', 'out': true},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in=${caseInfo.in}`, logger);
		const cachedParseTree = getCachedParseTreeFromPythonCode(caseInfo.in);
		const result = isDependingOnHeadingMode(cachedParseTree);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
};