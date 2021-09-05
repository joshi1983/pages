import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseCurlyBrackets(logger) {
	const cases = [
	{'code': `{
	{
		x = 1;
	}
}`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
	'type': ParseTreeTokenType.CODE_BLOCK,
	'val': null,
	'children': [
		{'val': '{'},
		{
			'type': ParseTreeTokenType.CODE_BLOCK,
			'val': null,
			'children': [
				{'val': '{'},
				{'val': '=', 'children': [
					{'val': 'x'},
					{'val': '1'},
				]},
				{'val': ';'},
				{'val': '}'}
			]
		},
		{'val': '}'}
	]
})}, {
	'code': `{
}

x = function() {

}`, 'numTopChildren': 2
},
{
	'code': `{
	f({"x": 1, "y": 2})
}`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
	'type': ParseTreeTokenType.CODE_BLOCK,
	'val': null,
	'children': [
		{'val': '{'},
		{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
			{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
			{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
				{'val': '('},
				{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION},
				{'val': ')'}
			]}
		]},
		{'val': '}'}
	]
})
},
	{'code': `f({type: 'image/png'});`, 'numTopChildren': 2}
	];

	processParseTestCases(cases, logger);
};