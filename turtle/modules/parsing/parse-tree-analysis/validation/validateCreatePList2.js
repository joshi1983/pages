import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const suffix = `  Click <span class="command">createPList2</span> to learn more about proper usage of the command.`;
const nonValueTypes = new Set([
	ParseTreeTokenType.LEAF
]);
const invalidValueChildTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.LEAF,
	ParseTreeTokenType.LONG_STRING_LITERAL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL
]);
const nonValueVals = new Set('[]()'.split(''));

function isValueToken(token) {
	if (nonValueTypes.has(token.type))
		return false;
	if (nonValueVals.has(token.val))
		return false;
	return true;
}

export function validateCreatePList2(cachedParseTree, parseLogger) {
	const createPList2Calls = cachedParseTree.getCommandCallsByName('createPList2');
	const tokenValues = cachedParseTree.getTokenValues();
	for (const call of createPList2Calls) {
		const child = call.children[0];
		if (child !== undefined) {
			const val = tokenValues.get(child);
			const keys = new Set();
			if (val instanceof Array) {
				val.forEach(function(pair, index) {
					if (!(pair instanceof Array))
						parseLogger.error(`Each key-value pair must be a list but found something else at item ${index + 1}.${suffix}`, child, true);
					else if (pair.length !== 2)
						parseLogger.error(`Each key-value pair must have a count of 2 but found ${pair.length} at item ${index + 1}.${suffix}`, child, true);
					else {
						if (keys.has(pair[0]))
							parseLogger.warn(`Only one value can be assigned to the same property but more than one value was indicated for assigned for property ${pair[0]}.`, child, true);
						keys.add(pair[0]);
					}
				});
			}
			else if (val === undefined && child.type === ParseTreeTokenType.LIST) {
				for (const grandChild of child.children) {
					let keyVal;
					if (grandChild.type === ParseTreeTokenType.LIST) {
						const valueTokens = grandChild.children.filter(isValueToken);
						if (valueTokens.length !== 2)
							parseLogger.error(`Each key-value pair must have a count of 2 but found ${valueTokens.length}.${suffix}`, grandChild, true);
						else {
							keyVal = tokenValues.get(valueTokens[0]);
						}
					}
					else if (invalidValueChildTypes.has(grandChild.type) &&
					grandChild.val !== '[' && grandChild.val !== ']')
						parseLogger.error(`Invalid key-value pair value.${suffix}`, grandChild, true);
					else {
						const pair = tokenValues.get(grandChild);
						if (pair instanceof Array)
							keyVal = pair[0];
					}
					if (keyVal !== undefined && keys.has(keyVal))
						parseLogger.warn(`Only one value can be assigned to the same property but more than one value was indicated for assigned for property ${keyVal}.`, child, true);
					keys.add(keyVal);
				}
			}
		}
	}
};