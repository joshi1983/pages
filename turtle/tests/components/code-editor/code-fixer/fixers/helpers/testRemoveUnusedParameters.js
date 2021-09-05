import { getCachedParseTreeFromCode } from
'../../../../../helpers/getCachedParseTreeFromCode.js';
import { getUnusedParameters, removeUnusedParameters } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/removeUnusedParameters.js';
import { processTestCases } from '../processTestCases.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

function testGetUnusedParameters(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'to p\nend', 'numResults': 0},
	{'code': 'to p :x\nend', 'numResults': 1},
	{'code': 'to p :x\nprint "x\nend', 'numResults': 1},
	{'code': 'to p :x\nprint :x\nend', 'numResults': 0},
	{'code': 'to p :x\nprint :X\nend', 'numResults': 0},
	{'code': 'to p :X\nprint :X\nend', 'numResults': 0},
	{'code': 'to p :X\nqueue2 "x 4\nend', 'numResults': 0},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const cTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const writeOptimizedCachedParseTree = new WriteOptimizedCachedParseTree(cTree.root, cTree.getProceduresMap());
		const result = getUnusedParameters(writeOptimizedCachedParseTree);
		const expectedResultLength = caseInfo.numResults;
		if (!(result instanceof Array))
			plogger(`Expected an Array but found ${result}`);
		else if (result.length !== expectedResultLength)
			plogger(`Expected ${expectedResultLength} but found ${result.length}`);
	});
}

function testGeneralCases(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'to p\nend', 'logged': false},
		{'code': 'to p :x\nprint :x\nend', 'logged': false},
		{'code': 'to p :x\nend', 'logged': true,
		'to': 'to p \nend'},
		{'code': 'to p :x\nend p 3', 'logged': true,
		'to': 'to p \nend p '},
	];
	processTestCases(cases, removeUnusedParameters, logger);
}

export function testRemoveUnusedParameters(logger) {
	wrapAndCall([
		testGeneralCases,
		testGetUnusedParameters
	], logger);
};