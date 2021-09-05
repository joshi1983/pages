import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { holyCExamples } from
'../../helpers/parsing/holyCExamples.js';
import { isLikelyBasic } from
'../../../modules/parsing/basic/isLikelyBasic.js';
import { logoInterpreterExamples } from
'../../helpers/parsing/logoInterpreterExamples.js';
import { old8bitBasicExamples } from
'../../helpers/parsing/basic/old8bitBasicExamples.js';
import { pitrifiedGoTurtleExamples } from '../../helpers/parsing/pitrifiedGoTurtleExamples.js';
import { processingExamples } from '../../helpers/parsing/processingExamples.js';
import { terrapinExamples } from
'../../helpers/parsing/terrapinExamples.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from '../../helpers/parsing/webLogoExamplesContent.js';

const nonExamples = [];
for (const nonExamples1 of [holyCExamples, logoInterpreterExamples,
pitrifiedGoTurtleExamples, processingExamples, terrapinExamples, webLogoExamplesContent]) {
	ArrayUtils.pushAll(nonExamples, nonExamples1);
}

/*
We are not testing with the dialect-specific examples because
they we don't care if isLikelyBasic detects them.
We don't care how isLikelyBasic handles the currently recognized specific dialects because
isLikelyBasic won't be used for code that is classified as them and handled by their translators.
*/
export function testIsLikelyBasic(logger) {
	const cases = nonExamples.map(function(ne) {
		return {
			'in': ne,
			'out': false
		};
	});
	old8bitBasicExamples.forEach(function(example) {
		cases.push({
			'in': example,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyBasic, logger);
};