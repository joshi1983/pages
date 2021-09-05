import { getAllVariableNamesSet } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/getAllVariableNamesSet.js';
import { getCachedParseTreeFromCode } from
'../../../../../helpers/getCachedParseTreeFromCode.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

function countVariables(logger) {
	return function(code) {
		const cachedParseTree = getCachedParseTreeFromCode(code, logger);
		const tree = new WriteOptimizedCachedParseTree(cachedParseTree.root);
		const namesSet = getAllVariableNamesSet(tree);
		return namesSet.size;
	}
}

export function testGetAllVariableNamesSet(logger) {
	const cases = [
	{'in': '', 'out': 0},
	{'in': 'make "x 3', 'out': 1},
	{'in': 'to p :x end', 'out': 1},
	{'in': 'to p localmake "x 3 end', 'out': 1},
	{'in': 'queue2 "x 0', 'out': 1},
	];
	testInOutPairs(cases, countVariables(logger), logger);
};