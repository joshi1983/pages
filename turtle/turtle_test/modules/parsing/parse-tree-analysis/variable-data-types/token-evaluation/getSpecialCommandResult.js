import { getNearestRepeat } from '../../getNearestRepeat.js';

const specialCommandNames = new Set(['repcount', 'repRatio']);

export function isSpecialCommand(commandInfo) {
	return specialCommandNames.has(commandInfo.primaryName);
};

export function getSpecialCommandResult(commandInfo, token, tokenValueMap) {
	if (specialCommandNames.has(commandInfo.primaryName)) {
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