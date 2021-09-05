import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseCodeBlocks(logger) {
	const cases = [
	{'code': `f();
{
	repcountPair = m;
};`, 'numTopChildren': 4},
	{'code': `f()
{
	repcountPair = m;
}`, 'numTopChildren': 2}
	];
	processParseTestCases(cases, logger);
};