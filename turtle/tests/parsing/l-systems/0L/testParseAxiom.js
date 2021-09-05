import { ParseTreeTokenType } from '../../../../modules/parsing/l-systems/0L/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseAxiom(logger) {
	const cases = [{
		'code': `; comment
axiom`, 'numTopChildren': 1,
	'numComments': 1
	},{
			'code': 'Axiom F',
			'numTopChildren': 1,
			'treeInfo': {
				'children': [
					{'val': null, 'type': ParseTreeTokenType.ASSIGNMENT,
					'children': [
						{'val': 'Axiom', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.COMMAND_SEQUENCE, 'children': [
							{'val': 'F', 'children': []}
						]}
					]
					}
				]
			}
		},
		{
			'code': 'Axiom = F',
			'numTopChildren': 1,
			'treeInfo': {
				'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT,
					'children': [
						{'val': 'Axiom', 'type': ParseTreeTokenType.IDENTIFIER, 'children':[]},
						{'val': null, 'type': ParseTreeTokenType.COMMAND_SEQUENCE, 'children': [
							{'val': 'F', 'children': []}
						]}
					]}
				]
			}
		},
		{
			'code': 'axiom = F-',
			'treeInfo': {
				'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT,
					'children': [
						{'val': 'axiom', 'type': ParseTreeTokenType.IDENTIFIER, 'children':[]},
						{'val': null, 'type': ParseTreeTokenType.COMMAND_SEQUENCE, 'children': [
							{'val': 'F', 'children': []},
							{'val': '-', 'children': []}
						]}
					]}
				]
			}
		}
	];
	processParseTestCases(cases, logger);
};