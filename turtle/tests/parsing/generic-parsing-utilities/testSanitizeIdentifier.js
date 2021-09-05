import { sanitizeIdentifier } from
'../../../modules/parsing/generic-parsing-utilities/sanitizeIdentifier.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testSanitizeIdentifier(logger) {
	const cases = [
	{'in': '', 'out': 'v'},
	{'in': '?', 'out': 'v?'},
	{'in': 'p', 'out': 'p'},
	{'in': '4p', 'out': 'p'},
	{'in': '4234p', 'out': 'p'},
	{'in': '42.34p', 'out': 'p'},
	{'in': 'P', 'out': 'P'},
	{'in': 'P3', 'out': 'P3'},
	{'in': '$P3', 'out': 'P3'},
	{'in': '$$P3', 'out': 'P3'},
	{'in': '$$P$3$', 'out': 'P3'},
	{'in': '&P3', 'out': 'P3'},
	{'in': '!P3', 'out': 'P3'},
	{'in': '-P-3', 'out': 'P3'},
	{'in': '@P3', 'out': 'P3'},
	{'in': '#P3', 'out': 'P3'},
	{'in': '_P3', 'out': '_P3'},
	{'in': '_P__3__', 'out': '_P__3__'},
	{'in': 'P3?', 'out': 'P3?'},
	{'in': 'P?3?', 'out': 'P3?'},
	{'in': '??P?3?', 'out': 'P3?'},
	];
	testInOutPairs(cases, sanitizeIdentifier, logger);
};