import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { fmsLogoExamples } from
'../../../helpers/parsing/fmsLogoExamples.js';
import { haskellExamples } from
'../../../helpers/parsing/haskellExamples.js';
import { holyCExamples } from
'../../../helpers/parsing/holyCExamples.js';
import { isLikelyJavaScript } from
'../../../../modules/parsing/other-languages/js-parsing/isLikelyJavaScript.js';
import { javascript2DCanvasExamples } from
'../../../helpers/parsing/javascript2DCanvasExamples.js';
import { javascriptProcessingExamples } from
'../../../helpers/parsing/javascriptProcessingExamples.js';
import { phpExamples } from
'../../../helpers/parsing/phpExamples.js';
import { pythonTurtleExampleFilesContent } from
'../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { turtleGraphicsFunExamples } from
'../../../helpers/parsing/turtleGraphicsFunExamples.js';
import { turtleToyNetExamples } from
'../../../helpers/parsing/turtleToyNetExamples.js';
import { wgslExamples } from
'../../../helpers/parsing/shaders/wgslExamples.js';

const nonExamples = ArrayUtils.combine(fmsLogoExamples, haskellExamples, holyCExamples,
phpExamples, pythonTurtleExampleFilesContent, qbasicExamples, wgslExamples);
const examples = ArrayUtils.combine(javascript2DCanvasExamples, javascriptProcessingExamples, turtleGraphicsFunExamples, turtleToyNetExamples);

export function testIsLikelyJavaScript(logger) {
	const cases = [
		{'in': 'char int 65.5', 'out': false},
			// input should be considered to be Logo instead of JavaScript.
		{'in': 'print int int 34.34', 'out': false},
	];
	ArrayUtils.pushAll(cases, nonExamples.map(function(code) {
		return {
			'in': code,
			'out': false
		};
	}));
	ArrayUtils.pushAll(cases, examples.map(function(code) {
		return {
			'in': code,
			'out': true
		};
	}));
	testInOutPairs(cases, isLikelyJavaScript, logger);
};