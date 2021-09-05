import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { batchExamples } from '../../helpers/parsing/batchExamples.js';
import { holyCExamples } from
'../../helpers/parsing/holyCExamples.js';
import { isLikelyPitrifiedGoTurtle } from '../../../modules/parsing/pitrified-go-turtle/isLikelyPitrifiedGoTurtle.js';
import { pitrifiedGoTurtleExamples } from '../../helpers/parsing/pitrifiedGoTurtleExamples.js';
import { processingExamples } from '../../helpers/parsing/processingExamples.js';
import { pythonTurtleExampleFiles } from
'../../helpers/parsing/pythonTurtleExampleFiles.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, batchExamples);
ArrayUtils.pushAll(nonExamples, holyCExamples);
ArrayUtils.pushAll(nonExamples, processingExamples);
ArrayUtils.pushAll(nonExamples, pythonTurtleExampleFiles);

export function testIsLikelyPitrifiedGoTurtle(logger) {
	const cases = [];
	pitrifiedGoTurtleExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	nonExamples.forEach(function(content) {
		cases.push({'in': content, 'out': false});
	});
	testInOutPairs(cases, isLikelyPitrifiedGoTurtle, logger);
};