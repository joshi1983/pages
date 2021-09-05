import { adaExamples } from
'../../../helpers/parsing/adaExamples.js';
import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { bcplExamples } from
'../../../helpers/parsing/bcplExamples.js';
import { cssExamples } from
'../../../helpers/parsing/cssExamples.js';
import { elmExamples } from
'../../../helpers/parsing/elmExamples.js';
import { forthExamples } from
'../../../helpers/parsing/forthExamples.js';
import { haskellExamples } from
'../../../helpers/parsing/haskellExamples.js';
import { hpglExamples } from
'../../../helpers/parsing/hpglExamples.js';
import { isLikelyElm } from
'../../../../modules/parsing/other-languages/elm/isLikelyElm.js';
import { luaExamples } from
'../../../helpers/parsing/luaExamples.js';
import { povRayExamples } from
'../../../helpers/parsing/povRayExamples.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(adaExamples,
bcplExamples, cssExamples,
forthExamples, haskellExamples, hpglExamples, luaExamples,
povRayExamples, processingExamples);

export function testIsLikelyElm(logger) {
	const cases = elmExamples.map(code => {
		return {
			'in': code,
			'out': true
		};
	});
	cases.push(
		{'in': 'import Html exposing (Html, text, pre)', 'out': true},
		{'in': 'import Html.Events exposing (onClick)', 'out': true}
	);
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	
	testInOutPairs(cases, isLikelyElm, logger);
};