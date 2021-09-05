import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseIndexExpression(logger) {
	const cases = [
	{'code': `x[di]`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
		'val': null,
		'children': [
			{'type': ParseTreeTokenType.IDENTIFIER,
			'val': 'x'},
			{'val': null, 'type': ParseTreeTokenType.INDEX_EXPRESSION, 'children': [
				{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET},
				{'val': 'di', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET}
			]}
		]}
	)},
	{'code': 'f()[0]', 'numTopChildren': 1},
	{'code': '"hello"[0]', 'numTopChildren': 1},
	{'code': '\'hello\'[0]', 'numTopChildren': 1},
	{'code': '`hello`[0]', 'numTopChildren': 1},
	{'code': 'this[methodName]()', 'numTopChildren': 1},
	{'code': 'f1[f2()]', 'numTopChildren': 1},
	{'code': 'this.sortedTokens[f()]', 'numTopChildren': 1},
	{'code': 'this.sortedTokens[Math.min(this.sortedTokens.length - 1, i + 1)]', 'numTopChildren': 1},
	{'code': 'x = [1, 2][i]', 'numTopChildren': 1},
	{'code': 'dp[i][j]', 'numTopChildren': 1},
	{'code': 'dp[i][j] = dp[i-1]', 'numTopChildren': 1},
	{'code': 'dp[i].length', 'numTopChildren': 1},
	{'code': 'checkInfo[0] + 1', 'numTopChildren': 1},
	{'code': `x = {
	'powerOf2': b[1][2]
}`, 'numTopChildren': 1},
	];
	processParseTestCases(cases, logger);
};