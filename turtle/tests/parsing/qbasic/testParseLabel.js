import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseLabel(logger) {
	const cases = [{
		'code': `ColorTab:`,
		'numTopChildren': 1
	},{
		'code': `Dim StdFrac%
ColorTab:`,
		'numTopChildren': 2
	},{
		'code': `Dim StdFrac%(scrX% - 1, scrY% - 1)
ColorTab:`,
		'numTopChildren': 2
	},{'code': `FOR spl = 50 TO 0 STEP -10
rander:`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'FOR', 'type': ParseTreeTokenType.FOR, 'children': [
					{'val': 'TO'},
					{'val': 'STEP'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': 'rander', 'type': ParseTreeTokenType.LABEL, 'children': []}
					]}
				]}
			]}
	},{
		'code': `IF 1 THEN
END IF
13`, 'numTopChildren': 2,
		'treeInfo': {
			'children': [
				{'val': 'IF', 'children': [
					{'val': '1'},
					{'val': 'THEN'},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.END_IF, 'children': [
						{'val': 'END'},
						{'val': 'IF'}
					]}
				]},
				{'val': '13', 'type': ParseTreeTokenType.LABEL}
			]}
	}];
	processParseTestCases(cases, logger);
};