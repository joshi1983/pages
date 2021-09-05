import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { batchExamples } from '../../helpers/parsing/batchExamples.js';
import { holyCExamples } from
'../../helpers/parsing/holyCExamples.js';
import { isLikelyTurtleGraphicsFun } from
'../../../modules/parsing/turtle-graphics-fun/isLikelyTurtleGraphicsFun.js';
import { pitrifiedGoTurtleExamples } from '../../helpers/parsing/pitrifiedGoTurtleExamples.js';
import { processingExamples } from '../../helpers/parsing/processingExamples.js';
import { pythonTurtleExampleFiles } from
'../../helpers/parsing/pythonTurtleExampleFiles.js';
import { rustTurtleExamples } from
'../../helpers/parsing/rustTurtleExamples.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { turtleGraphicsFunExamples } from
'../../helpers/parsing/turtleGraphicsFunExamples.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, batchExamples);
ArrayUtils.pushAll(nonExamples, holyCExamples);
ArrayUtils.pushAll(nonExamples, pitrifiedGoTurtleExamples);
ArrayUtils.pushAll(nonExamples, processingExamples);
ArrayUtils.pushAll(nonExamples, pythonTurtleExampleFiles);
ArrayUtils.pushAll(nonExamples, rustTurtleExamples);

export function testIsLikelyTurtleGraphicsFun(logger) {
	const cases = turtleGraphicsFunExamples.map(code => {
		return {
			'in': code,
			'out': true
		};
	});
	nonExamples.forEach(function(content) {
		cases.push({'in': content, 'out': false});
	});
	testInOutPairs(cases, isLikelyTurtleGraphicsFun, logger);
};