import { functionDefinitionToName } from
'../../../../../modules/parsing/qbasic/parsing/parse-tree-analysis/functionDefinitionToName.js';
import { functionDefinitionTypes } from
'../../../../../modules/parsing/qbasic/parsing/functionDefinitionTypes.js';
import { getDescendentsOfTypes } from
'../../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfTypes.js';
import { parse } from
'../../../../../modules/parsing/qbasic/parse.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedFunctionDefinitionToName(logger) {
	return function(code) {
		const parseResult = parse(code);
		const tokens = getDescendentsOfTypes(parseResult.root, functionDefinitionTypes).
			filter(t => t.children.length !== 0);
		if (tokens.length !== 1)
			logger(`Expected to find exactly 1 token for a function definition but found ${tokens.length}.  code=${code}`);
		else {
			const t = tokens[0];
			return functionDefinitionToName(t);
		}
	};
}

export function testFunctionDefinitionToName(logger) {
	const cases = [
		{'in': 'DECLARE SUB Move ()', 'out': 'move'},
		{'in': 'function A()\nend function', 'out': 'a'},
		{'in': 'sub A()\nend sub', 'out': 'a'},
		{'in': 'def A()\n', 'out': 'a'}
	];
	testInOutPairs(cases, wrappedFunctionDefinitionToName(logger), logger);
};