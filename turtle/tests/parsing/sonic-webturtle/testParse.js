import { parse } from '../../../modules/parsing/sonic-webturtle/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/sonic-webturtle/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParse(logger) {
	const cases = [
	{'code': '; hello world', 'numTopChildren': 0, 'numComments': 1},
	{'code': '# hello world', 'numTopChildren': 0, 'numComments': 1},
	{'code': 'let x 3', 'numTopChildren': 1, 'numComments': 0},
	{'code': 'let x 3\ndraw 3', 'numTopChildren': 2, 'numComments': 0},
	{'code': 'draw 3', 'numTopChildren': 1, 'numComments': 0},
	{'code': 'draw 3\nend', 'numTopChildren': 2, 'numComments': 0},
	{'code': 'COLOR ORANGE', 'numTopChildren': 1, 'numComments': 0},
	{'code': 'COLOR ORANGE\nRIGHT 90\n\nDRAW 150', 'numTopChildren': 3, 'numComments': 0},
	{'code': 'REPEAT 3\nNEXT', 'numTopChildren': 1, 'numComments': 0},
	{'code': 'REPEAT 3\nDRAW 100\nNEXT', 'numTopChildren': 1, 'numComments': 0},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};