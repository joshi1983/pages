import { ArrayUtils } from '../../../../../../modules/ArrayUtils.js';
import { basic256Examples } from
'../../../../../helpers/parsing/basic/basic256Examples.js';
import { bbcBasicExamples } from
'../../../../../helpers/parsing/basic/bbcBasicExamples.js';
import { isLikelySeaTurtle } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/sea-turtle/isLikelySeaTurtle.js';
import { microAExamples } from
'../../../../../helpers/parsing/basic/microAExamples.js';
import { pBasicExamples } from
'../../../../../helpers/parsing/basic/pBasicExamples.js';
import { qbasicExamples } from
'../../../../../helpers/parsing/basic/qbasicExamples.js';
import { seaTurtleExamples } from
'../../../../../helpers/parsing/seaTurtleExamples.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from '../../../../../helpers/parsing/webLogoExamplesContent.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, basic256Examples);
ArrayUtils.pushAll(nonExamples, bbcBasicExamples);
ArrayUtils.pushAll(nonExamples, microAExamples);
ArrayUtils.pushAll(nonExamples, pBasicExamples);
ArrayUtils.pushAll(nonExamples, qbasicExamples);
ArrayUtils.pushAll(nonExamples, webLogoExamplesContent);

export function testIsLikelySeaTurtle(logger) {
	const cases = [];
	seaTurtleExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	nonExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelySeaTurtle, logger);
};