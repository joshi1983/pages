import { SonicWebTurtleOperators } from '../SonicWebTurtleOperators.js';
const operatorSymbols = SonicWebTurtleOperators.getAllOperatorsData().map(info => info.symbol);

function isStartOfOperator(s) {
	for (const symbol of operatorSymbols) {
		if (symbol.startsWith(s))
			return true;
	}
	return false;
}

function isInvalidatingNumber(consumedPart, nextChar) {
	if (consumedPart === '')
		return false;
	if (!isNaN(consumedPart) && isNaN(consumedPart + nextChar))
		return true;
	return false;
}

export function isMarkingEndOfToken(consumedPart, nextChar) {
	if (!isNaN(consumedPart + nextChar))
		return false;
	if (isInvalidatingNumber(consumedPart, nextChar))
		return true;
	if (isStartOfOperator(consumedPart) && !isStartOfOperator(consumedPart + nextChar))
		return true;
	if (!isStartOfOperator(consumedPart) && isStartOfOperator(nextChar))
		return true;
	return false;
};