import { evaluateToken } from
'../../../../../modules/parsing/other-languages/joss/evaluation/evaluateToken.js';
import { parse } from
'../../../../../modules/parsing/other-languages/joss/parsing/parse.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedEvaluateToken(logger) {
	return function(code) {
		const parseResult = parse(code);
		const root = parseResult.root;
		if (root.children.length !== 1)
			logger(`Expected 1 child token of root but found ${root.children.length}.  code=${code}`);
		else {
			const lineOfCodeToken = root.children[0];
			if (lineOfCodeToken.children.length !== 1)
				logger(`Expected 1 child token of LINE_OF_CODE but found ${lineOfCodeToken.children.length}.  code=${code}`);
			else
				return evaluateToken(lineOfCodeToken.children[0]);
		}
	};
}

export function testEvaluateToken(logger) {
	const cases = [
		{'in': '1', 'out': 1},
		{'in': '2', 'out': 2},
		{'in': '"hi"', 'out': 'hi'}
	];
	testInOutPairs(cases, wrappedEvaluateToken(logger), logger);
};