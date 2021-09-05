import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { forToStepValue } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/forToStepValue.js';
import { parse } from
'../../../../../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedForToStepValue(logger) {
	return function(code) {
		const parseResult = parse(code);
		const tokens = flatten(parseResult.root);
		const forToken = findToken({'type': ParseTreeTokenType.FOR}, tokens, logger);
		return forToStepValue(forToken);
	}
}

export function testForToStepValue(logger) {
	const cases = [
		{'in': 'for', 'out': undefined},
		{'in': 'for (', 'out': undefined},
		{'in': 'for (;;)', 'out': undefined},
		{'in': 'for (;;) {}', 'out': undefined},
		{'in': 'for (A;B;C) {}', 'out': undefined},
		{'in': 'for (A;B;) {}', 'out': undefined},
		{'in': 'for (A;B;x*=3) {}', 'out': undefined},
		{'in': 'for (A;B;x/=3) {}', 'out': undefined},
		{'in': 'for (A;B;p.x++) {}', 'out': 1},
		{'in': 'for (A;B;p.x+=3) {}', 'out': 3},
		{'in': 'for (A;B;x++) {}', 'out': 1},
		{'in': 'for (A;B;x--) {}', 'out': -1},
		{'in': 'for (A;B;++x) {}', 'out': 1},
		{'in': 'for (A;B;--x) {}', 'out': -1},
		{'in': 'for (A;B;x+=2) {}', 'out': 2},
		{'in': 'for (A;B;x-=2) {}', 'out': -2},
	];
	testInOutPairs(cases, wrappedForToStepValue(logger), logger);
};