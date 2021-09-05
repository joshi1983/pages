import { Command } from '../../Command.js';
import { CommandDataTypes } from '../CommandDataTypes.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { processRequiredTypes } from './processRequiredTypes.js';
await Command.asyncInit();
await DataTypes.asyncInit();

const primaryNames = CommandDataTypes.getCommandNamesWhereRequiredParameterTypesAffectEachOther();

export function processRequiredTypeParameters(cachedParseTree, tokenTypesMap, variables) {
	const callTokens = cachedParseTree.getCommandCallsByNames(primaryNames);
	const allTypes = DataTypes.getAllTypesString();
	callTokens.forEach(function(callToken) {
		const containingProc = cachedParseTree.getProcedureAtToken(callToken);
		const info = Command.getCommandInfo(callToken.val);
		const primaryName = info.primaryName;
		function getParameterTypes(index) {
			let result = tokenTypesMap.get(callToken.children[index]);
			if (result === undefined)
				result = allTypes;
			else
				return result.toString();
		}
		for (let i = 0; i < callToken.children.length; i++) {
			const requiredTypes = CommandDataTypes.getRequiredParameterTypes(primaryName, i, getParameterTypes);
			processRequiredTypes(callToken.children[i], requiredTypes, variables, containingProc);
		}
	});
};