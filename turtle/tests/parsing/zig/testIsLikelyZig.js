import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { cssExamples } from '../../helpers/parsing/cssExamples.js';
import { holyCExamples } from
'../../helpers/parsing/holyCExamples.js';
import { isLikelyZig } from
'../../../modules/parsing/zig/isLikelyZig.js';
import { pythonTurtleExampleFilesContent } from
'../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { rustTurtleExamples } from
'../../helpers/parsing/rustTurtleExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { zigExamples } from '../../helpers/parsing/zigExamples.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, cssExamples);
ArrayUtils.pushAll(nonExamples, holyCExamples);
ArrayUtils.pushAll(nonExamples, pythonTurtleExampleFilesContent);
ArrayUtils.pushAll(nonExamples, rustTurtleExamples);

export function testIsLikelyZig(logger) {
	const cases = [];
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	zigExamples.forEach(function(code) {
		cases.push({'in': code, 'out': true});
	});
	testInOutPairs(cases, isLikelyZig, logger);
};