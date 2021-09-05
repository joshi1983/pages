import { cheerfulNetherlandsLogoExamples } from
'../../../../../helpers/parsing/cheerfulNetherlandsLogoExamples.js';
import { isLikelyCheerfulNetherlandsLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/cheerful-netherlands-logo/isLikelyCheerfulNetherlandsLogo.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

const cases = cheerfulNetherlandsLogoExamples.map(function(content) {
	return {
		'in': content,
		'out': true
	};
});

export function testIsLikelyCheerfulNetherlandsLogo(logger) {
	testInOutPairs(cases, isLikelyCheerfulNetherlandsLogo, logger);
};