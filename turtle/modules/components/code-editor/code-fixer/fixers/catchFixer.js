import { Command } from
'../../../../parsing/Command.js';
import { DataTypes } from
'../../../../parsing/data-types/DataTypes.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';
import { mayWantToReplaceWithSecondArgInstructionList, replaceWithSecondArgInstructionList } from
'./helpers/replaceWithSecondArgInstructionList.js';
await DataTypes.asyncInit();

const stringType = new DataTypes('string');

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'catch' ||
	!mayWantToReplaceWithSecondArgInstructionList(token))
		return false;

	const next = token.nextSibling;
	if (!stringType.mayBeCompatibleWith(next))
		return false;
	if (next.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(next.val);
		if (info !== undefined) {
			if (info.returnTypes === null)
				return false;
			const dataTypes = new DataTypes(info.returnTypes);
			if (!dataTypes.hasIntersectionWith(stringType))
				return false;
		}
	}

	return true;
}

export function catchFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	tokens.forEach(function(catchToken) {
		replaceWithSecondArgInstructionList(catchToken, cachedParseTree);
		fixLogger.log(`Replaced catch call with the listed instructions because WebLogo does not support catch like some other Logo varients do.`, catchToken);
	});
};