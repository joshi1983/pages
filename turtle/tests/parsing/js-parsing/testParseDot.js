import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseDot(logger) {
	const cases = [
		{'code': 'data.byteLength < checkInfo1 + checkInfo2[1].length', 'numTopChildren': 1}
	];
	processParseTestCases(cases, logger);
};