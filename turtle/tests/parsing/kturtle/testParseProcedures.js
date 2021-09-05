import { ParseTreeTokenType } from '../../../modules/parsing/kturtle/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseProcedures(logger) {
	const cases = [ {
		'code': `learn faculty $x {
	$r = 1
}`, 'numTopChildren': 1,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.LEARN, 'val': 'learn',
				'children': [
					{'val': 'faculty'},
					{'val': null, 'type': ParseTreeTokenType.PARAMETERS_PARENT, 'children': [
						{'val': '$x'}
					]},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{'},
						{'val': '='},
						{'val': '}'}
					]}
				]}
			]
		}
	}, {
		'code': `learn p {
}`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'learn', 'children': [
					{'val': 'p'},
					{'val': null, 'type': ParseTreeTokenType.PARAMETERS_PARENT},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
				]}
			]
		}
	}, {
		'code': `learn circle $X {
	repeat 36 {
	}
}
go 200 ,200`, 'numTopChildren': 2
	}, 
	];
	processParseTestCases(cases, logger);
};