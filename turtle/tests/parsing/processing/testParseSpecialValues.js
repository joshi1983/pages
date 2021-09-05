import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseSpecialValues(logger) {
	const cases = [
		{'code': 'null', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.NULL
		})},
	];
	processParseTestCases(cases, logger);
};