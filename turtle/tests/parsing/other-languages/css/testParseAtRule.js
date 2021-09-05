import { parse } from
'../../../../modules/parsing/other-languages/css/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/other-languages/css/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseAtRule(logger) {
	const cases = [
	{'code': `@font-face{
    font-family:"Font Awesome 5 Free";
}`, 'numTopChildren': 1,
	'treeInfo': wrapSingleTreeInfoObject({
		'val': '@font-face', 'type': ParseTreeTokenType.AT_RULE, 'children': [
			{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK,
			'children': [
				{'val': '{'},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION},
				{'val': '}'},
			]}
		]
	})
	},
	{
		'code': `@keyframes {    
   from,to{
}
}`,
		'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject({
		'val': '@keyframes', 'type': ParseTreeTokenType.AT_RULE, 'children': [
			{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK,
			'children': [
				{'val': '{'},
				{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
					{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
						{'val': 'from'},
						{'val': ','},
						{'val': 'to'},
					]},
					{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK}
				]},
				{'val': '}'},
			]}
		]})
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};