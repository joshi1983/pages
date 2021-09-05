import { ParseTreeTokenType } from '../../../modules/parsing/kturtle/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParse(logger) {
	const cases = [{
		'code': '',
		'numTopChildren': 0
	}, {
		'code': 'true',
		'numTopChildren': 1,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.BOOLEAN_LITERAL, 'val': 'true'}
			]
		}
	},{
		'code': '$x = "hi"',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT, 'children': [
				{'val': '=', 'children': [
					{'val': '$x'},
					{'val': '"hi"'}
				]},
			]
		}
	}];
	processParseTestCases(cases, logger);
};