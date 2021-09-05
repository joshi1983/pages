import { evaluateStringLiteralVal } from
'../../../modules/parsing/parse-tree-analysis/evaluateStringLiteralVal.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

export function testEvaluateStringLiteralVal(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': 'hi', 'out': 'hi'},
	{'in': '"hi"', 'out': '"hi"'},
	{'in': 'its', 'out': 'its'},
	{'in': 'it\\\'s', 'out': 'it\'s'},
	{'in': 'it\\\'s J\\\'s', 'out': 'it\'s J\'s'},
	];
	testInOutPairs(cases, evaluateStringLiteralVal, logger);
};