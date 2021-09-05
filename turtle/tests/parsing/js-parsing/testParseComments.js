import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseComments(logger) {
	const cases = [
		{'code': '', 'numTopChildren': 0, 'maxDepth': 1, 'numComments': 0},
		{'code': '// hi', 'numTopChildren': 0, 'maxDepth': 1, 'numComments': 1},
		{'code': 'console.log("hi");// hi', 'numTopChildren': 2, 'maxDepth': 5, 'numComments': 1},
		{'code': '// hi\n// world', 'numTopChildren': 0, 'maxDepth': 1, 'numComments': 2},
		{'code': '/* hi*/', 'numTopChildren': 0, 'maxDepth': 1, 'numComments': 1},
		{'code': '/* h//i*/', 'numTopChildren': 0, 'maxDepth': 1, 'numComments': 1},
		{'code': '/* h//i*//**/', 'numTopChildren': 0, 'maxDepth': 1, 'numComments': 2},
	];
	processParseTestCases(cases, logger);
};