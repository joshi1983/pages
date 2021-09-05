import { ParseTreeTokenType } from '../../../modules/parsing/kturtle/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseCommandCalls(logger) {
	const cases = [{
		'code': 'turnright 90',
		'numTopChildren': 1
	}, {
		'code': 'print "hi world"',
		'numTopChildren': 1
	},{
		'code': 'canvassize $depth-1, 0.7*$length',
		'numTopChildren': 1,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'canvassize', 'children': [
					{'val': '-', 'children': [
						{'val': '$depth'},
						{'val': '1'}
					]},
					{'val': ','},
					{'val': '*', 'children': [
						{'val': '0.7'},
						{'val': '$length'}
					]}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};