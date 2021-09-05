import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { forTokenToRepeatCount } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/forTokenToRepeatCount.js';
import { parse } from
'../../../../../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedForTokenToRepeatCount(logger) {
	return function(code) {
		const parseResult = parse(code);
		const tokens = flatten(parseResult.root);
		const forToken = findToken({'type': ParseTreeTokenType.FOR}, tokens, logger);
		if (forToken !== undefined) {
			return forTokenToRepeatCount(forToken);
		}
	};
}

export function testForTokenToRepeatCount(logger) {
	const cases = [
		{'in': 'for', 'out': undefined},
		{'in': 'for (', 'out': undefined},
		{'in': 'for () {}', 'out': undefined},
		{'in': 'for (int x: a) {}', 'out': undefined},
		{'in': 'for (;) {}', 'out': undefined},
		{'in': 'for (;;) {}', 'out': undefined},
		{'in': 'for (int x = 0;;) {}', 'out': undefined},
		{'in': 'for (int x = 0;x < 100;) {}', 'out': undefined},
		{'in': 'for (int x = 0;p.x < 100;) {}', 'out': undefined},
		{'in': 'for (int x = 0;p.x < 100;x++) {}', 'out': undefined},
		{'in': 'for (int x = 0;x < 100;p.x++) {}', 'out': undefined},
		{'in': 'for (p.x = 0;x < 100;x++) {}', 'out': undefined},
		{'in': 'for (x = 0;x + 100;x++) {}', 'out': undefined},
		{'in': 'for (x = 0;100 + x;x++) {}', 'out': undefined},
		{'in': 'for (x = 0;x - 100;x++) {}', 'out': undefined},
		{'in': 'for (x = 0;x * 100;x++) {}', 'out': undefined},
		{'in': 'for (x = 0;x / 100;x++) {}', 'out': undefined},
		{'in': 'for (x = 0;x();x++) {}', 'out': undefined},
		{'in': 'for (x = 0;x < 100;x++) {}', 'out': 100},
		{'in': 'for (x = 1;x < 100;x++) {}', 'out': 99},
		{'in': 'for (int x = 1;x < 100;x++) {}', 'out': 99},
		{'in': 'for (x = 0;x <= 100;x++) {}', 'out': 101},
		{'in': 'for (x = 0;x < 100;x+=2) {}', 'out': 50},
		{'in': 'for (x = 0;x != 2;x++) {}', 'out': 2},
		{'in': 'for (x = 0;x == 2;x++) {}', 'out': 0},
		{'in': 'for (x = 0;2 > x;x++) {}', 'out': 2},
		{'in': 'for (x = 0;-2 < x;x--) {}', 'out': 2},
		{'in': 'for (int x = 0;x > -2;x--) {}', 'out': 2},
		{'in': 'for (int x = 0;x >= -2;x--) {}', 'out': 3},
		{'in': 'for (int x = 0;x < 100;x++) {}', 'out': 100},
		{'in': 'for (int x = 0;x < 100;x+=10) {}', 'out': 10},
		{'in': 'for (int x = 1; x == 1; x++) {}', 'out': 1},
		{'in': 'for (int x = 1; 1 == x; x++) {}', 'out': 1}
	];
	testInOutPairs(cases, wrappedForTokenToRepeatCount(logger), logger);
};