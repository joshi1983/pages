import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

/*
With-statements are deprecated but we want
the JavaScript parser to be robust enough to
cover the deprecated feature.

With-statements are documented here:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with
*/
export function testParseWith(logger) {
	const cases = [
		{'code': 'with ([1, 2, 3]) {}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'with', 'type': ParseTreeTokenType.WITH, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '('},
						{'val': null, 'children': [
							{'val': '['},
							{'val': '1'},
							{'val': ','},
							{'val': '2'},
							{'val': ','},
							{'val': '3'},
							{'val': ']'}
						]},
						{'val': ')'}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{'},
						{'val': '}'}
					]}
				]}
			]
		}},
		{'code': `with ([1, 2, 3]) {
  console.log(toString()); // 1,2,3
}`, 'numTopChildren': 1}
	];
	processParseTestCases(cases, logger);
};