import { parse } from
'../../../modules/parsing/css/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/css/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from '../../helpers/parsing/processParseTestCases.js';

export function testParseAttributeSelector(logger) {
	const cases = [
	{'code': '[title]', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': wrapSingleTreeInfoObject({
		'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
			{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
				{'val': null, 'type': ParseTreeTokenType.ATTRIBUTE_SELECTOR, 'children': [
					{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET},
					{'val': 'title', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET},
				]}
			]}
		]})
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};