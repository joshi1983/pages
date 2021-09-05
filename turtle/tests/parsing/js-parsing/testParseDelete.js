import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseDelete(logger) {
	const cases = [
	{'code': 'delete Employee',
	'ignoreQuality': true,
	'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.DELETE,
		'val': 'delete',
		'children': [
			{'val': 'Employee', 'type': ParseTreeTokenType.IDENTIFIER}
		]
		}),
	},
	{'code': 'delete Employee.firstname',
	'ignoreQuality': true,
	'numTopChildren': 1,
	'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.DELETE,
		'val': 'delete',
		'children': [
			{'val': 'Employee',
			'children': [
				{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
					{'val': 'firstname'}
				]}
			]}
		]
	})}
	];
	processParseTestCases(cases, logger);
};