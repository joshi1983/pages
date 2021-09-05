import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseSpreadOperator(logger) {
	const cases = [
	{'code': 'f(...arguments)', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.FUNCTION_CALL,
		'children': [
			{'val': 'f'},
			{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
				{'val': '...', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
					{'val': 'arguments'}
				]}
			]}
		]
	})}
	];
	processParseTestCases(cases, logger);
};