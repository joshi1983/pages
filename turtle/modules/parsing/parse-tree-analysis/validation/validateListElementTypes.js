import { Command } from '../../Command.js';
import { DataTypes } from '../../data-types/DataTypes.js';

/*
Validates data types for elements within lists.
For example, this could check if a token evaluates to a list specifically of numbers.
*/
export function validateListElementTypes(cachedParseTree, parseLogger) {
	const commandTokens = cachedParseTree.getCommandCallsArray().filter(function(token) {
		if (token.children.length === 0)
			return false;
		const info = Command.getCommandInfo(token.val);
		for (let i = Math.min(token.children.length, info.args.length) - 1; i >= 0; i--) {
			const arg = info.args[i];
			if (arg.listElementTypes !== undefined)
				return true;
		}
		return false;
	});
	const tokenValues = cachedParseTree.getTokenValues();
	commandTokens.forEach(function(token) {
		const info = Command.getCommandInfo(token.val);
		info.args.forEach(function(arg, index) {
			if (token.children.length > index && arg.listElementTypes !== undefined) {
				const v = tokenValues.get(token.children[index]);
				if (v instanceof Array) {
					const requiredTypes = new DataTypes(arg.listElementTypes);
					for (let i = 0; i < v.length; i++) {
						const actualTypes = DataTypes.getTypesCompatibleWithValue(v[i]);
						if (!requiredTypes.hasIntersectionWith(actualTypes)) {
							parseLogger.error('The list must contain elements with types ' + arg.listElementTypes + ' but an item at index ' + (i + 1) + ' does not match these types.', token.children[index]);
						}
					}
				}
			}
		});
	});
};