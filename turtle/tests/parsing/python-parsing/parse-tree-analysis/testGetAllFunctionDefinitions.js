import { getAllFunctionDefinitions } from '../../../../modules/parsing/python-parsing/parse-tree-analysis/getAllFunctionDefinitions.js';
import { getCachedParseTreeFromPythonCode } from '../../../helpers/parsing/getCachedParseTreeFromPythonCode.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export async function testGetAllFunctionDefinitions(logger) {
	const cases = [
		{'code': 'x = 4', 'numDefinitions': 0},
		{'code': 'def f():\n\tpass', 'numDefinitions': 1},
		{'code': 'def f():\n\tpass\n\ndef g():', 'numDefinitions': 2},
		{'code': 'def f():\n\tglobal x\n\tpass',
			'numDefinitions': 1
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromPythonCode(caseInfo.code);
		const functions = getAllFunctionDefinitions(tree);
		if (!(functions instanceof Array))
			plogger(`Expected an Array but got ${functions}`);
		else if (functions.length !== caseInfo.numDefinitions)
			plogger(`Expected ${caseInfo.numDefinitions} function definitions but got ${functions.length}`);
	});
};