import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseSpecialValues(logger) {
	const cases = [
		{'code': 'undefined', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.UNDEFINED
		})},
		{'code': 'null', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.NULL
		})},
	];
	processParseTestCases(cases, logger);
};