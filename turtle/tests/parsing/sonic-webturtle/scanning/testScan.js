import { processScanTestCases } from '../../processScanTestCases.js';
import { scan } from '../../../../modules/parsing/sonic-webturtle/scanning/scan.js';

export function testScan(logger) {
	const cases = [
	{'code': '', 'len': 0},
	{'code': '#hi world', 'len': 1, 'tokens': ['#hi world']},
	{'code': '# PROCNAME', 'len': 1, 'tokens': ['# PROCNAME']},
	{'code': ';hi world', 'len': 1, 'tokens': [';hi world']},
	{'code': 'go PATTERN\n', 'len': 2, 'tokens': ['go', 'PATTERN']},
	{'code': 'draw 3 end', 'len': 3, 'tokens': ['draw', '3', 'end']},
	{'code': 'MOVE M*L', 'len': 4, 'tokens': ['MOVE', 'M', '*', 'L']},
	{'code': 'MOVE M*L/2', 'len': 6, 'tokens': ['MOVE', 'M', '*', 'L', '/', '2']},
	{'code': 'COLOR -1', 'len': 2, 'tokens': ['COLOR', '-1']},
	{'code': 'COLOR +1', 'len': 2, 'tokens': ['COLOR', '+1']},
	{'code': 'MOVE L/2', 'len': 4, 'tokens': ['MOVE', 'L', '/', '2']},
	{'code': 'LET L L/3', 'len': 5, 'tokens': ['LET', 'L', 'L', '/', '3']},
	{'code': 'LET $L L/3', 'len': 3, 'tokens': ['LET', '$L', 'L/3']},
	{'code': 'PRINT Hello +-*\/World!!', 'len': 2, 'tokens': ['PRINT', 'Hello +-*\/World!!']},
	{'code': 'LET $M A flower!', 'len': 3, 'tokens': ['LET', '$M', 'A flower!']},
	{'code': 'print ^', 'len': 2, 'tokens': ['print', '^']},
	{'code': 'LET X ^', 'len': 3, 'tokens': ['LET', 'X', '^']},
	{'code': 'LET X ^1', 'len': 3, 'tokens': ['LET', 'X', '^1']},
	{'code': 'LET X ^1+^2', 'len': 5, 'tokens': ['LET', 'X', '^1', '+', '^2']},
	{'code': 'if 3 < 2\nendif', 'len': 5, 'tokens': ['if', '3', '<', '2', 'endif']},
	{'code': 'if 3 < 2endif', 'len': 5, 'tokens': ['if', '3', '<', '2', 'endif']},
	// not supported by Sonic WebTurtle but we might as well be more 
	// robust and handle bad user input anyway.

	{'code': 'if 3<2\nendif', 'len': 5, 'tokens': ['if', '3', '<', '2', 'endif']},
	// The actual Sonic WebTurtle interpreter appears to fail at separating the 3<2 but
	// that doesn't mean we shouldn't be robust enough to do that anyway.
	{'code': 'if 3<=2\nendif', 'len': 5, 'tokens': ['if', '3', '<=', '2', 'endif']},
	{'code': 'if 3>=2\nendif', 'len': 5, 'tokens': ['if', '3', '>=', '2', 'endif']},
	{'code': 'if 3 - 2<5\nendif', 'len': 7, 'tokens': ['if', '3', '-', '2', '<', '5', 'endif']},
	{'code': 'if 3 + 2<5\nendif', 'len': 7, 'tokens': ['if', '3', '+', '2', '<', '5', 'endif']},
	{'code': 'if 3-2<5\nendif', 'len': 7, 'tokens': ['if', '3', '-', '2', '<', '5', 'endif']},
	{'code': 'if 3+2<5\nendif', 'len': 7, 'tokens': ['if', '3', '+', '2', '<', '5', 'endif']},
	{'code': 'LET D D-1', 'len': 5, 'tokens': ['LET', 'D', 'D', '-', '1']},
	{'code': 'LET LEN 40/D', 'len': 5, 'tokens': ['LET', 'LEN', '40', '/', 'D']},
	];
	processScanTestCases(cases, scan, logger);
};