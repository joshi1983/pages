import { Command } from '../../Command.js';
import { doesInstructionListOutputDirectly } from './doesInstructionListOutputDirectly.js';
import { OutputFrequency } from './OutputFrequency.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();

export function getInstructionListRepeatCountAdvanced(instructionListToken, tokenValueMap, repeatCounts, tokenToIsAlwaysOutputting) {
	if (instructionListToken.parentNode !== null &&
	instructionListToken.parentNode.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const commandToken = instructionListToken.parentNode;
		const info = Command.getCommandInfo(commandToken.val);
		let outputFrequency = tokenToIsAlwaysOutputting.get(instructionListToken);
		function single(val) {
			let min = val;
			if (outputFrequency === OutputFrequency.Always) {
				val = Math.min(1, val);
				min = val;
			}
			else if (outputFrequency === OutputFrequency.Sometimes)
				min = Math.min(1, val);
			else
				min = val;
			return {
				'min': min,
				'max': val
			};
		}
		if (info.primaryName === 'if') {
			let conditionValue = tokenValueMap.get(commandToken.children[0]);
			if (conditionValue !== undefined) {
				if (conditionValue === true)
					return single(1);
				else
					return single(0);
			}
			else
				return {'min': 0, 'max': 1};
		}
		if (info.primaryName === 'ifelse') {
			const conditionValue = tokenValueMap.get(commandToken.children[0]);
			const count = commandToken.children.indexOf(instructionListToken) - 1;
			if (conditionValue !== undefined) {
				if (conditionValue === true)
					return single(1 - count);
				else
					return single(count);
			}
			else
				return {'min': 0, 'max': 1};
		}
		else if (info.primaryName === 'for') {
			const forControls = commandToken.children[0];
			const settings = forControls.children.filter(t => !t.isBracket()).map(t => tokenValueMap.get(t));
			if (settings.every((v, index) => index === 0 || (v !== undefined && !isNaN(v)))) {
				let count;
				if (settings.length === 4) {
					count = 1 + Math.ceil((settings[2] - settings[1]) / settings[3]);
				}
				else if (settings.length === 3) {
					count = Math.ceil(Math.abs(settings[2] - settings[1]));
				}
				if (!isNaN(count)) {
					return single(count);
				}
			}
		}
		else if (info.primaryName === 'forever') {
			if (outputFrequency === OutputFrequency.Always)
				return single(1);
			return { // infinite loop.
				'min': 2,
				'max': undefined
			};
		}
		else if (info.primaryName === 'while' || info.primaryName === 'do.while') {
			const conditionIndex = info.primaryName === 'while' ? 0 : 1;
			const conditionValue = tokenValueMap.get(commandToken.children[conditionIndex]);
			if (conditionValue !== undefined) {
				if (conditionValue) {
					if (outputFrequency === OutputFrequency.Always)
						return single(1);
					else {
						return { // infinite loop.
							'min': 2,
							'max': undefined
						};
					}
				}
				else
					return single(0);
			}
		}
		else if (info.primaryName === 'repeat') {
			let repeatCount = tokenValueMap.get(commandToken.children[0]);
			if (repeatCount !== undefined) {
				return single(Math.floor(repeatCount));
			}
		}
		else if (info.primaryName === 'until') {
			let conditionValue = tokenValueMap.get(commandToken.children[0]);
			if (conditionValue !== undefined) {
				if (conditionValue === true)
					return single(0);
				else {
					if (outputFrequency === OutputFrequency.Always)
						return single(1);
					else
						return {
							'min': 2,
							'max': undefined
						};
				}
			}
		}
	}
};