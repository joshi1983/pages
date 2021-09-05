import { isLikelyQBasic } from
'../../../modules/parsing/qbasic/isLikelyQBasic.js';
import { qbasicExamples } from
'../../helpers/parsing/qbasicExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { smallVisualBasicExamples } from
'../../helpers/parsing/smallVisualBasicExamples.js';
import { webLogoExamplesContent } from
'../../helpers/parsing/webLogoExamplesContent.js';

export function testIsLikelyQBasic(logger) {
	const cases = webLogoExamplesContent.concat(smallVisualBasicExamples).map(function(content) {
		return {
			'in': content,
			'out': false
		};
	});
	qbasicExamples.forEach(function(content) {
		// Remove the first 'REM '-prefixed lines to test isLikelyBasic with more difficult content.
		content = content.replace(/^\n*(rem\s[^\n]*\n)*/i, '');

		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyQBasic, logger);
};