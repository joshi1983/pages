import { getNearestRepeat } from '../../getNearestRepeat.js';
import { isNumber } from '../../../../isNumber.js';

const specialCommandNames = new Set(['between?', 'repcount', 'repRatio']);

export function isSpecialCommand(commandInfo) {
	return specialCommandNames.has(commandInfo.primaryName);
};

export function getSpecialCommandResult(commandInfo, token, tokenValueMap) {
	if (commandInfo.primaryName === 'between?' && token.children.length === 3) {
		const val1 = tokenValueMap.get(token.children[0]);
		const num1 = tokenValueMap.get(token.children[1]);
		const num2 = tokenValueMap.get(token.children[2]);
		if (isNumber(num1) && isNumber(num2)) {
			if (num1 === num2)
				return false; // if the interval is empty, between? will always return false.
		}
		if (isNumber(val1) && (val1 === num1 || val1 === num2))
			return false;
			// between? interval excludes the boundary values so if val1 matches either of them, false is always returned.
	}
	else if (specialCommandNames.has(commandInfo.primaryName)) {
		const nearestRepeat = getNearestRepeat(token);
		if (nearestRepeat !== undefined) {
			const firstChildValue = tokenValueMap.get(nearestRepeat.children[0]);
			if (firstChildValue <= 1) {
				if (commandInfo.primaryName === 'repcount')
					return 1;
				else
					return 0;
			}
		}
	}
};