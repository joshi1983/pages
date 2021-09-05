import { parse } from
'../../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { typesTokenToString } from
'../../../../../modules/parsing/pitrified-go-turtle/parsing/parse-tree-analysis/typesTokenToString.js';

function wrappedTypesTokenToString(logger) {
	return function(code) {
		const parseResult = parse(code);
		const children = parseResult.root.children;
		if (children.length !== 1)
			logger(`Case code=${code}, expected 1 child but found ${children.length}`);
		else
			return typesTokenToString(children[0]);
	};
}

export function testTypesTokenToString(logger) {
	const cases = [
		{'in': 'int', 'out': 'int'},
		{'in': 'float', 'out': 'float'},
		{'in': 'str', 'out': 'str'},
		{'in': 'string', 'out': 'string'},
		{'in': '[]int', 'out': '[]int'},
		{'in': '*int', 'out': '*int'},
		{'in': '[][]int', 'out': '[][]int'},
		{'in': 'chan int', 'out': 'chan int'}
	];
	testInOutPairs(cases, wrappedTypesTokenToString(logger), logger);
};