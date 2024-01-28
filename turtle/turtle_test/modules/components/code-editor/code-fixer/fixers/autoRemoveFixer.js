import { DataTypes } from '../../../../parsing/data-types/DataTypes.js';
import { getTokenTypesBasic } from '../../../../parsing/parse-tree-analysis/variable-data-types/getTokenTypesBasic.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../../parsing/Procedure.js';
import { UnsupportedCommand } from '../../../../parsing/UnsupportedCommand.js';
await DataTypes.asyncInit();

function isOfInterest(token) {
	if (Procedure.isNameToken(token))
		return false;
	const info = UnsupportedCommand.getUnsupportedCommandInfo(token.val);
	if (info === undefined)
		return false;
	if (info.autoRemove !== true)
		return false;
	if (info.args !== undefined && info.args.length > 0) {
		let sibling = token.nextSibling;
		for (let i = 0; i < info.args.length; i++) {
			if (sibling === null)
				return false;
			const argInfo = info.args[i];
			// is this token definitely compatible with the type?
			const tokenTypes = getTokenTypesBasic(sibling, false);
			if (tokenTypes === undefined)
				return false;
			const requiredArgTypes = new DataTypes(argInfo.types);
			if (false === requiredArgTypes.hasIntersectionWith(tokenTypes))
				return false;
			sibling = sibling.nextSibling;
		}
	}
	return true;
}

/*
Removes any unsupported command marked with autoRemove: true from json/unsupportedCommands.json.
*/
export function autoRemoveFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	tokens.forEach(function(token) {
		const info = UnsupportedCommand.getUnsupportedCommandInfo(token.val);
		if (info.args !== undefined) {
			for (let i = 0; i < info.args.length; i++) {
				const nextSibling = token.nextSibling;
				nextSibling.remove();
				cachedParseTree.tokenRemoved(nextSibling);
			}
		}
		token.remove();
		cachedParseTree.tokenRemoved(token);
		fixLogger.log(`Removed call to ${token.val} because it is not useful`, token);
	});
};