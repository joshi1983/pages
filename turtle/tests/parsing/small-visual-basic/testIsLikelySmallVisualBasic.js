import { isLikelySmallVisualBasic } from
'../../../modules/parsing/small-visual-basic/isLikelySmallVisualBasic.js';
import { smallVisualBasicExamples } from
'../../helpers/parsing/smallVisualBasicExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from
'../../helpers/parsing/webLogoExamplesContent.js';

export function testIsLikelySmallVisualBasic(logger) {
	const cases = smallVisualBasicExamples.map(function(content) {
		return {
			'in': content,
			'out': true
		};
	});
	webLogoExamplesContent.forEach(function(webLogoExampleContent) {
		cases.push({
			'in': webLogoExampleContent,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelySmallVisualBasic, logger);
};