import { Command } from
'../../../../parsing/Command.js';
import { DataTypes } from
'../../../../parsing/data-types/DataTypes.js';
import { IntegerType } from
'../../../../parsing/data-types/IntegerType.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';
import { mayWantToReplaceWithSecondArgInstructionList, replaceWithSecondArgInstructionList } from
'./helpers/replaceWithSecondArgInstructionList.js';
await DataTypes.asyncInit();

const intType = new DataTypes('int');

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'ask' ||
	!mayWantToReplaceWithSecondArgInstructionList(token))
		return false;

	const next = token.nextSibling;
	if (!IntegerType.mayBeInt(next))
		return false;
	if (next.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(next.val);
		if (info !== undefined) {
			if (info.returnTypes === null)
				return false;
			const dataTypes = new DataTypes(info.returnTypes);
			if (!dataTypes.hasIntersectionWith(intType))
				return false;
		}
	}

	return true;
}

export function askFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	tokens.forEach(function(askToken) {
		replaceWithSecondArgInstructionList(askToken, cachedParseTree);
		fixLogger.log(`Replaced ask call with the listed instructions because WebLogo does not support multiple concurrent turtles.`, askToken);
	});
};