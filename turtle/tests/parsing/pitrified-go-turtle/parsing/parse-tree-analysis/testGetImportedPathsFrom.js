import { getImportedPathsFrom } from
'../../../../../modules/parsing/pitrified-go-turtle/parsing/parse-tree-analysis/getImportedPathsFrom.js';
import { parse } from
'../../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedGetImportedPathsFrom(logger) {
	return function(code) {
		const parseResult = parse(code);
		const result = getImportedPathsFrom(parseResult.root);
		if (!(result instanceof Set))
			logger(`Expected a Set but found ${result}`);
		return Array.from(result);
	};
}

export function testGetImportedPathsFrom(logger) {
	const cases = [
		{'in': 'import "fmt"', 'out': ['fmt']},
		{'in': 'import . "fmt"', 'out': ['fmt']},
		{'in': 'import ("fmt" "log")', 'out': ['fmt', 'log']}
	];
	testInOutPairs(cases, wrappedGetImportedPathsFrom(logger), logger);
};