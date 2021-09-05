import { fetchJson } from '../../../../modules/fetchJson.js';
import { isIdentifier } from '../../../../modules/parsing/pov-ray/scanning/isIdentifier.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
const colorData = await fetchJson('json/logo-migrations/pov-ray/colors.json');

export function testIsIdentifier(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'a', 'out': true},
	{'in': 'a1', 'out': true},
	{'in': '_', 'out': true},
	{'in': '_a', 'out': true},
	{'in': '_1', 'out': true},
	{'in': 'x012345678901234567890123456789012345678', 'out': true},
	// identifiers can be up to 40 characters long.
	{'in': 'x0123456789012345678901234567890123456789', 'out': false},
	// identifiers can't be longer than 40 characters according to the "up to 40" in:
	// https://www.povray.org/documentation/view/3.6.1/228/
	];
	'0123456789*()!~`.,-+/\\'.split('').forEach(function(ch) {
		cases.push({'in': ch, 'out': false});
	});
	colorData.forEach(function(colorInfo) {
		cases.push({'in': colorInfo.name, 'out': true});
	});
	testInOutPairs(cases, isIdentifier, logger);
};