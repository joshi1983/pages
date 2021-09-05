import { Command } from '../../Command.js';
await Command.asyncInit();
const primaryNamesOfInterest = Command.getAllCommandsInfo().
	filter(info => info.compositeValidation instanceof Array &&
		info.compositeValidation.some(checkInfo => checkInfo.type === 'equalLengthList')).
		map(info => info.primaryName);

function getLength(token, tokenValues) {
	const val = tokenValues.get(paramToken1);
	if (val instanceof Array)
		return val.length;
}

export function validateEqualLengthList(cachedParseTree, parseLogger) {
	const callsOfInterest = cachedParseTree.getCommandCallsByNames(primaryNamesOfInterest);
	if (callsOfInterest.length === 0)
		return;
	const tokenValues = cachedParseTree.getTokenValues();
	callsOfInterest.forEach(function(callToken) {
		const info = Command.getCommandInfo(callToken.val);
		const equalLengthListChecks = info.compositeValidation.filter(info => info.type === 'equalLengthList');
		equalLengthListChecks.forEach(function(checkInfo) {
			const paramToken1 = callToken.children[checkInfo.arg1Index];
			const paramToken2 = callToken.children[checkInfo.arg2Index];
			const param1Len = cachedParseTree.getLengthFromToken(paramToken1);
			const param2Len = cachedParseTree.getLengthFromToken(paramToken2);
			if (param1Len !== undefined && param2Len !== undefined) {
				if (param1Len !== param2Len) {
					parseLogger.error(`In command ${callToken.val}, the arguments ${checkInfo.arg1} and ${checkInfo.arg2} must have equal length but you gave lengths ${param1Len} and ${param2Len}`,
						callToken);
				}
			}
		});
	});
};