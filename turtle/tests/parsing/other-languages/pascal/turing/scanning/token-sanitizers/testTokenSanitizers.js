import { testExpandAbbreviatedKeywords } from
'./testExpandAbbreviatedKeywords.js';
import { testJoinOperatorsContainingWhitespace } from
'./testJoinOperatorsContainingWhitespace.js';
import { testRemoveSpacesInPairs } from
'./testRemoveSpacesInPairs.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

export function testTokenSanitizers(logger) {
	wrapAndCall([
		testExpandAbbreviatedKeywords,
		testJoinOperatorsContainingWhitespace,
		testRemoveSpacesInPairs
	], logger);
};