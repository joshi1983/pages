import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../../modules/parsing/basic/qbasic/parse.js';
import { shouldUseCustomProcessTokenForToken } from
'../../../../../../modules/parsing/basic/texas-instruments-99-4a/translation-to-weblogo/type-processors/shouldUseCustomProcessTokenForToken.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedShouldUseCustomProcessTokenForToken(code) {
	const parseResult = parse(code);
	const allTokens = flatten(parseResult.root);
	const applicableTokens = allTokens.filter(shouldUseCustomProcessTokenForToken);
	return applicableTokens.length;
}

export function testShouldUseCustomProcessTokenForToken(logger) {
	const cases = [
		{'in': '10 CALL PRINT "HI"', 'out': 0},
		{'in': '10 CALL KEY(0, x, s)', 'out': 1},
		{'in': '10 CALL JOYST(0, x, y)', 'out': 1}
	];
	testInOutPairs(cases, wrappedShouldUseCustomProcessTokenForToken, logger);
};