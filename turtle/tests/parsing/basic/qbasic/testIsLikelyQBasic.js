import { isLikelyQBasic } from
'../../../../modules/parsing/basic/qbasic/isLikelyQBasic.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { smallVisualBasicExamples } from
'../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { webLogoExamplesContent } from
'../../../helpers/parsing/webLogoExamplesContent.js';

const smallExamples = [
'CIRCLE step(320, 100), 200',
'pset step(0, 0)',
'line step(0, 0), step(100, 0)'
];

export function testIsLikelyQBasic(logger) {
	const cases = webLogoExamplesContent.concat(smallVisualBasicExamples).map(function(content) {
		return {
			'in': content,
			'out': false
		};
	});
	qbasicExamples.concat(smallExamples).forEach(function(content) {
		// Remove the first 'REM '-prefixed lines to test isLikelyBasic with more difficult content.
		content = content.replace(/^\n*(rem\s[^\n]*\n)*/i, '');

		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyQBasic, logger);
};