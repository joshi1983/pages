import { isNumber } from '../../../isNumber.js';

const msgPrefix = 'sumOfFirst requires each list element to have a numeric first.  ';

export function validateSumOfFirsts(cachedParseTree, parseLogger) {
	const calls = cachedParseTree.getCommandCallsByName('sumOfFirsts');
	const tokenValues = cachedParseTree.getTokenValues();
	calls.forEach(function(call) {
		const child = call.children[0];
		const operandValue = tokenValues.get(child);
		if (operandValue instanceof Array) {
			for (let i = 0; i < operandValue.length; i++) {
				const sublist = operandValue[i];
				if (sublist instanceof Array) {
					if (sublist.length === 0)
						parseLogger.error(`${msgPrefix}Item ${i + 1} is empty.`, call);
					else if (!isNumber(sublist[0])) {
						parseLogger.error(`${msgPrefix}Item ${i + 1} has a first element that is not a number.`, call);
					}
				}
			}
		}
	});
};