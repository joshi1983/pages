import { parse } from
'../../../../../../../../../../modules/parsing/css/parse.js';
import { testInOutPairs } from
'../../../../../../../../../helpers/testInOutPairs.js';

function wrapFunc(f) {
	return function(code) {
		const parseResult = parse(code);
		const root = parseResult.root;
		if (root.children.length !== 1)
			return `Expected 1 top child but got ${root.children.length}`;
		const token = root.children[0];
		return f(token);
	};
}

export function processFontCases(cases, isFunc, logger) {
	testInOutPairs(cases, wrapFunc(isFunc), logger);
};