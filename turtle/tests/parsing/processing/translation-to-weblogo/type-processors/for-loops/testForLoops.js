import { testForTokenToCodeBlock } from './testForTokenToCodeBlock.js';
import { testForToConditionToken } from './testForToConditionToken.js';
import { testForToInitToken } from './testForToInitToken.js';
import { testForTokenToConditionVariableName } from './testForTokenToConditionVariableName.js';
import { testForTokenToInitialValue } from './testForTokenToInitialValue.js';
import { testForTokenToInitVariableName } from './testForTokenToInitVariableName.js';
import { testForTokenToRepeatCount } from './testForTokenToRepeatCount.js';
import { testForTokenToStepVariableName } from './testForTokenToStepVariableName.js';
import { testForToStepToken } from './testForToStepToken.js';
import { testForToStepValue } from './testForToStepValue.js';
import { testShouldTranslateToRepeat } from './testShouldTranslateToRepeat.js';
import { testShouldTranslateToRepeatWithConstantLimit } from './testShouldTranslateToRepeatWithConstantLimit.js';
import { testShouldTranslateToRepeatWithLimitExpression } from './testShouldTranslateToRepeatWithLimitExpression.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testForLoops(logger) {
	wrapAndCall([
		testForToConditionToken,
		testForToInitToken,
		testForTokenToCodeBlock,
		testForTokenToConditionVariableName,
		testForTokenToInitialValue,
		testForTokenToInitVariableName,
		testForTokenToRepeatCount,
		testForTokenToStepVariableName,
		testForToStepToken,
		testForToStepValue,
		testShouldTranslateToRepeat,
		testShouldTranslateToRepeatWithConstantLimit,
		testShouldTranslateToRepeatWithLimitExpression
	], logger);
};