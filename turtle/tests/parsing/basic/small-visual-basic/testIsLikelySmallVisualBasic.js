import { commodoreBasicExamples } from
'../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelySmallVisualBasic } from
'../../../../modules/parsing/basic/small-visual-basic/isLikelySmallVisualBasic.js';
import { microAExamples } from
'../../../helpers/parsing/basic/microAExamples.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../helpers/parsing/basic/sinclairBasicExamples.js';
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
	webLogoExamplesContent.concat(microAExamples).concat(qbasicExamples).concat(commodoreBasicExamples).
	concat(sinclairBasicExamples).
	forEach(function(webLogoExampleContent) {
		cases.push({
			'in': webLogoExampleContent,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelySmallVisualBasic, logger);
};