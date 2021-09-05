import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseCurvedBracketExpression(logger) {
	const cases = [
	{'code': '(checkInfo2[1][i])', 'numTopChildren': 1},
	{'code': '(checkInfo1 !== checkInfo2[1][i])', 'numTopChildren': 1},
	{'code': '(data[checkInfo1[0] + i] !== checkInfo2[1][i])', 'numTopChildren': 1}
	];
	processParseTestCases(cases, logger);
};