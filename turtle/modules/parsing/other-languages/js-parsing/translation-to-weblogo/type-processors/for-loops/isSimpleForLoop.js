import { getIncrementAmountFromForToken } from './getIncrementAmountFromForToken.js';
import { getInitialValue } from './getInitialValue.js';
import { getLimitFromForToken } from './getLimitFromForToken.js';
import { getVariableNameFromForToken } from './getVariableNameFromForToken.js';

export function isSimpleForLoop(token) {
	const varName = getVariableNameFromForToken(token);
	if (varName === undefined)
		return false;
	const initValue = getInitialValue(token);
	if (initValue === undefined)
		return false;
	if (getLimitFromForToken(token) === undefined)
		return false;
	if (undefined === getIncrementAmountFromForToken(token))
		return false;
	return true;
}