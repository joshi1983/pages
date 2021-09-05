import { shouldTranslateToRepeatWithConstantLimit } from './shouldTranslateToRepeatWithConstantLimit.js';
import { shouldTranslateToRepeatWithLimitExpression } from './shouldTranslateToRepeatWithLimitExpression.js';

export function shouldTranslateToRepeat(forToken) {
	return shouldTranslateToRepeatWithConstantLimit(forToken) ||
		shouldTranslateToRepeatWithLimitExpression(forToken);
};