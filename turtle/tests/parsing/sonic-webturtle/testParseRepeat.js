import { parse } from '../../../modules/parsing/sonic-webturtle/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/sonic-webturtle/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseRepeat(logger) {
	const cases = [
	{'code': 'repeat 2 next', 'numTopChildren': 1, 'numComments': 0},
	{'code': 'repeat 2\ndraw 3\nnext', 'numTopChildren': 1, 'numComments': 0},
	{'code': 'repeat 2 next draw 3', 'numTopChildren': 2, 'numComments': 0},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};