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
		'code': '$x = ask "Give me a number."',
		'numTopChildren': 1,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				'children': [
					{'val': '$x'},
					{'val': 'ask', 'children': [
						{'val': '"Give me a number."'}
					]}
				]}
			]
		}
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