import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { forTokenToInitialValue } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/forTokenToInitialValue.js';
import { parse } from
'../../../../../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedForTokenToInitialValue(logger) {
	return function(code) {
		const parseResult = parse(code);
		const tokens = flatten(parseResult.root);
		const forToken = findToken({'type': ParseTreeTokenType.FOR}, tokens, logger);
		if (forToken !== undefined) {
			return forTokenToInitialValue(forToken);
		}
	};
}

export function testForTokenToInitialValue(logger) {
	const cases = [
		{'in': 'for () {}', 'out': undefined},
		{'in': 'for (;;) {}', 'out': undefined},
		{'in': 'for (x--;;) {}', 'out': undefined},
		{'in': 'for (--x;;) {}', 'out': undefined},
		{'in': 'for (int x;;) {}', 'out': undefined},
		{'in': 'for (int x=0;;) {}', 'out': 0},
		{'in': 'for (int x=10;;) {}', 'out': 10},
		{'in': 'for (x=0;;) {}', 'out': 0},
		{'in': 'for (x=4;;) {}', 'out': 4},
		{'in': 'for (t=4;;) {}', 'out': 4}
	];
	testInOutPairs(cases, wrappedForTokenToInitialValue(logger), logger);
};