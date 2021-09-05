import { testForToInitValue } from
'./testForToInitValue.js';
import { testForToRepeatCount } from
'./testForToRepeatCount.js';
import { testForToStepNumber } from
'./testForToStepNumber.js';
import { testShouldTranslateToDoWhile } from
'./testShouldTranslateToDoWhile.js';
import { testShouldTranslateToRepeat } from
'./testShouldTranslateToRepeat.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testForLoops(logger) {
	wrapAndCall([
		testForToInitValue,
		testForToRepeatCount,
		testForToStepNumber,
		testShouldTranslateToDoWhile,
		testShouldTranslateToRepeat
	], logger);
};