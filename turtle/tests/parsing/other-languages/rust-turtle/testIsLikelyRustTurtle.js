import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { batchExamples } from
'../../../helpers/parsing/batchExamples.js';
import { holyCExamples } from
'../../../helpers/parsing/holyCExamples.js';
import { gleamExamples } from
'../../../helpers/parsing/gleamExamples.js';
import { isLikelyRustTurtle } from
'../../../../modules/parsing/other-languages/rust-turtle/isLikelyRustTurtle.js';
import { pitrifiedGoTurtleExamples } from
'../../../helpers/parsing/pitrifiedGoTurtleExamples.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { pythonTurtleExampleFiles } from
'../../../helpers/parsing/pythonTurtleExampleFiles.js';
import { rustTurtleExamples } from
'../../../helpers/parsing/rustTurtleExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { wgslExamples } from
'../../../helpers/parsing/shaders/wgslExamples.js';
import { zigExamples } from
'../../../helpers/parsing/zigExamples.js';

const nonExamples = ArrayUtils.combine(batchExamples, gleamExamples, holyCExamples,
pitrifiedGoTurtleExamples, processingExamples, pythonTurtleExampleFiles, wgslExamples, zigExamples);

export function testIsLikelyRustTurtle(logger) {
	const cases = [];
	rustTurtleExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	nonExamples.forEach(function(content) {
		cases.push({'in': content, 'out': false});
	});
	testInOutPairs(cases, isLikelyRustTurtle, logger);
};