import { getConditionToken } from './getConditionToken.js';
import { getIncrementAmountFromForToken } from './getIncrementAmountFromForToken.js';
import { getInitialValue } from './getInitialValue.js';
import { getLimitFromForToken } from './getLimitFromForToken.js';
import { getVariableNameFromForToken } from './getVariableNameFromForToken.js';

function getLimitForSimpleForLoop(conditionToken, limitValue, incrementAmount) {
	const symbol = conditionToken.val;
	if (symbol === '<') {
		return limitValue - incrementAmount;
	}
	if (symbol === '>') {
		return limitValue - incrementAmount;
	}
	if (conditionToken.val === '!==' || conditionToken.val === '!=') {
		return limitValue - incrementAmount;
	}
	return limitValue;
}

export function processForSimple(token, result) {
	const varName = getVariableNameFromForToken(token);
	const initialValue = getInitialValue(token);
	const limit = getLimitFromForToken(token);
	const conditionToken = getConditionToken(token);
	const incrementAmount = getIncrementAmountFromForToken(token);
	const limitForSimpleForLoop = getLimitForSimpleForLoop(conditionToken, limit, incrementAmount);
	let increment = '';
	if (incrementAmount !== 1)
		increment = ' ' + incrementAmount;
	result.append(`for ["${varName} ${initialValue} ${limitForSimpleForLoop}${increment}]`);
}