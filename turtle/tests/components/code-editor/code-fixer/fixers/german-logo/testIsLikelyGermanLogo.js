import { germanLogoExamples } from
'../../../../../helpers/parsing/germanLogoExamples.js';
import { isLikelyGermanLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/german-logo/isLikelyGermanLogo.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testIsLikelyGermanLogo(logger) {
	const cases = [];
	germanLogoExamples.forEach(function(code) {
		cases.push({'in': code, 'out': true});
	});
	testInOutPairs(cases, isLikelyGermanLogo, logger);
};