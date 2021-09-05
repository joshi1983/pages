import { Command } from '../../Command.js';
import { DeepEquality } from '../../../DeepEquality.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { valueToString } from '../../../valueToString.js';
await Command.asyncInit();
const primaryNamesOfInterest = Command.getAllCommandsInfo().
	filter(info => info.compositeValidation instanceof Array &&
		info.compositeValidation.some(checkInfo => checkInfo.type === 'notEqual')).
		map(info => info.primaryName);
const commandsReturningSameValuesWhenPassedTogether = new Set([
'fillColor', 'penColor', 'penSize', 'pos', 'xCor', 'yCor', 'zCor'
]);


function alwaysEvaluatesEqual(token1, token2) {
	if (token1.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
	token2.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info1 = Command.getCommandInfo(token1.val);
		const info2 = Command.getCommandInfo(token2.val);
		if (info1 !== undefined && info2 !== undefined) {
			if (info1.primaryName === info2.primaryName &&
			commandsReturningSameValuesWhenPassedTogether.has(info1.primaryName))
				return true;
		}
	}
	return false;
}

export function validateNotEqual(cachedParseTree, parseLogger) {
	const callsOfInterest = cachedParseTree.getCommandCallsByNames(primaryNamesOfInterest);
	if (callsOfInterest.length === 0)
		return;
	const tokenValues = cachedParseTree.getTokenValues();
	callsOfInterest.forEach(function(callToken) {
		const info = Command.getCommandInfo(callToken.val);
		const notEqualChecks = info.compositeValidation.filter(info => info.type === 'notEqual');
		notEqualChecks.forEach(function(checkInfo) {
			const paramToken1 = callToken.children[checkInfo.arg1Index];
			const paramToken2 = callToken.children[checkInfo.arg2Index];
			const paramToken1Val = tokenValues.get(paramToken1);
			const paramToken2Val = tokenValues.get(paramToken2);
			let msg;
			if (paramToken1Val !== undefined && DeepEquality.equals(paramToken1Val, paramToken2Val)) {
				msg = `In command ${callToken.val}, the arguments ${checkInfo.arg1} and ${checkInfo.arg2} ` +
				`must not be equal but you gave values ${valueToString(paramToken1Val)} and ${valueToString(paramToken2Val)}`;
			}
			else if (paramToken1.type === ParseTreeTokenType.VARIABLE_READ &&
			paramToken2.type === ParseTreeTokenType.VARIABLE_READ &&
			paramToken1.val.toLowerCase() === paramToken2.val.toLowerCase()) {
				msg = `In command ${callToken.val}, the arguments ${checkInfo.arg1} and ${checkInfo.arg2} must not be equal but you passed variable ${paramToken1.val} as both.`;
			}
			else if (alwaysEvaluatesEqual(paramToken1, paramToken2))
				msg = `In command ${callToken.val}, the arguments ${checkInfo.arg1} and ${checkInfo.arg2} must not be equal but you passed the same value for both.`;
			if (msg !== undefined)
				parseLogger.error(msg, callToken);
		});
	});
};