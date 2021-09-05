import { commodoreBasicExamples } from
'../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelySmallVisualBasic } from
'../../../../modules/parsing/basic/small-visual-basic/isLikelySmallVisualBasic.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { smallVisualBasicExamples } from
'../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from
'../../../helpers/parsing/webLogoExamplesContent.js';

export function testIsLikelySmallVisualBasic(logger) {
	const cases = smallVisualBasicExamples.map(function(content) {
		return {
			'in': content,
			'out': true
		};
	});
	webLogoExamplesContent.concat(qbasicExamples).concat(commodoreBasicExamples).
	forEach(function(webLogoExampleContent) {
		cases.push({
			'in': webLogoExampleContent,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelySmallVisualBasic, logger);
};