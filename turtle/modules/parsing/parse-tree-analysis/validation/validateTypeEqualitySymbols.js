import { Command } from '../../Command.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { getPossibleDataTypesEvaluatedFromToken } from '../getPossibleDataTypesEvaluatedFromToken.js';

// Get commands such as "mix" which use this data type constraint.
const typeEqualityCommands = Command.getCommandsWithTypeEqualitySymbols().
	map(info => info.primaryName);

function getIntersectedTypes(token, typesString, proceduresMap) {
	const varNamesNotToCheck = new Set();
	const possibleTypes = getPossibleDataTypesEvaluatedFromToken(token, proceduresMap, varNamesNotToCheck);
	const requiredTypes = DataTypes.parse(typesString);
	const types = new DataTypes(requiredTypes);
	types.intersectWith(possibleTypes);
	return types;
}

export function validateTypeEqualitySymbols(cachedParseTree, parseLogger) {
	const commandCalls = cachedParseTree.getCommandCallsByNames(typeEqualityCommands).
	filter(function(token) {
		const commandInfo = Command.getCommandInfo(token.val);
		return token.children.length >= commandInfo.args.length;
	});
	commandCalls.forEach(function(commandCallToken) {
		const commandInfo = Command.getCommandInfo(commandCallToken.val);
		const numParams = Math.min(commandCallToken.children.length, commandInfo.args.length);
		const symbolsChecked = new Set();
		for (let i = 0; i < numParams; i++) {
			const symbol = commandInfo.args[i].typeEqualitySymbol;
			if (symbol !== undefined && !symbolsChecked.has(symbol)) {
				const types = getIntersectedTypes(commandCallToken.children[i], commandInfo.args[i].types, cachedParseTree.getProceduresMap());
				// if required types and possible types may be compatible, look at other inputs sharing the same equal type symbol.
				if (!types.isEmpty()) {
					const requiredTypes = new DataTypes(commandInfo.args[i].types);
					const topType = requiredTypes.getTypesContaining(types);
					if (!topType.isEmpty()) {
						for (let j = i + 1; j < numParams; j++) {
							if (commandInfo.args[j].typeEqualitySymbol === symbol) {
								const types2 = getIntersectedTypes(commandCallToken.children[j], commandInfo.args[j].types, cachedParseTree.getProceduresMap());
								if (!types2.isEmpty() && !topType.hasIntersectionWith(types2)) {
									const iName = commandInfo.args[i].name;
									const jName = commandInfo.args[j].name;
									if (commandInfo.args[j].disableTypeEqualitySymbolIfTypes !== types2.toString())
										parseLogger.error(`Inputs ${iName} and ${jName} must be of matching type ${topType} since the value provided for ${iName} is of that type.  The type(s) provided for ${jName} were determined to be ${types2}.`, commandCallToken.children[j]);
								}
							}
						}
					}
					symbolsChecked.add(symbol);
				}
			}
		}
	});
};