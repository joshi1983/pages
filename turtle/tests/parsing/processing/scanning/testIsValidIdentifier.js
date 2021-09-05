import { isValidIdentifier } from '../../../../modules/parsing/js-parsing/scanning/isValidIdentifier.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsValidIdentifier(logger) {
	const cases = [
		{'in': '', 'out': false}, // must not be empty
		{'in': '4', 'out': false}, // must not start with a digit
		{'in': 'x y', 'out': false}, // must not contain whitespaces
		{'in': ' ', 'out': false}, // must not contain whitespaces
		{'in': ' x', 'out': false},
		{'in': '\tx', 'out': false},
		{'in': '\rx', 'out': false},
		{'in': '\nx', 'out': false},
		{'in': '|', 'out': false},
		{'in': '<', 'out': false},
		{'in': '<<', 'out': false},
		{'in': '=', 'out': false},
		{'in': '+=', 'out': false},
		{'in': '-=', 'out': false},
		{'in': '*=', 'out': false},
		{'in': '==', 'out': false},
		{'in': 'undefined', 'out': false},
		{'in': 'null', 'out': false},
		{'in': 'i+', 'out': false},
		{'in': 'x', 'out': true},
		{'in': 'x4', 'out': true},
		{'in': 'X', 'out': true},
		{'in': 'break', 'out': false}, // reserved words are not valid identifiers.
		{'in': 'X5', 'out': true},
		{'in': 'xy', 'out': true},
		{'in': 'a', 'out': true},
		{'in': '$', 'out': true},
		{'in': '_', 'out': true},
		{'in': '__', 'out': true},
		{'in': '_x', 'out': true},
		{'in': '_$', 'out': true},
		{'in': '?', 'out': false},
		{'in': '_?', 'out': false},
		{'in': 'x?', 'out': false},
		{'in': 'x123?', 'out': false},
		{'in': 'x12?3', 'out': false},
	];
	testInOutPairs(cases, isValidIdentifier, logger);
};