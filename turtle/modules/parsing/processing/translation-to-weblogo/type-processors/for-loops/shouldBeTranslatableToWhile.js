import { forToConditionToken } from './forToConditionToken.js';

export function shouldBeTranslatableToWhile(forToken) {
	const conditionToken = forToConditionToken(forToken);
	if (conditionToken === null)
		return false;

	return true;
};