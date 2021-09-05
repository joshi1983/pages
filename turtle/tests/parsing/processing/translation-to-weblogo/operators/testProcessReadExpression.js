import { processProcessTestCases } from './processProcessTestCases.js';
import { processReadExpression } from
'../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/operators/processReadExpression.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/processing/ParseTreeTokenType.js';

export function testProcessReadExpression(logger) {
	const cases = [
	{'code': 'x += 4;', 'token': {'val': 'x'}, 'out': ' :x '},
	{'code': 'this.x += 4;', 'token': {'val': 'x'}, 'out': ' ( getProperty "this "x ) '},
	{'code': 'x[4] += 4;',
		'token': {'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION},
		'out': ' ( item 5 :x ) '
	},
	{'code': 'x[0] += 4;',
		'token': {'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION},
		'out': ' ( item 1 :x ) '
	},
	{'code': 'x[y] += 4;',
		'token': {'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION},
		'out': ' ( item 1 + :y :x ) '
	},
	{'code': 'x[0][1]',
	'token': {'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
		'hasParentType': ParseTreeTokenType.TREE_ROOT},
	'out': ' ( item 2 ( item 1 :x ) ) '},
	{'code': 'x[0][1][100]',
	'token': {'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
		'hasParentType': ParseTreeTokenType.TREE_ROOT},
	'out': ' ( item 101 ( item 2 ( item 1 :x ) ) ) '},
	{'code': 'x[y][z]',
	'token': {'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
		'hasParentType': ParseTreeTokenType.TREE_ROOT},
	'out': ' ( item 1 + :z ( item 1 + :y :x ) ) '},
	{'code': 'x.t[y][z]',
	'token': {'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
		'hasParentType': ParseTreeTokenType.TREE_ROOT},
	'out': ' ( item 1 + :z ( item 1 + :y ( getProperty "x "t ) ) ) '},
	];
	processProcessTestCases(cases, processReadExpression, logger);
};