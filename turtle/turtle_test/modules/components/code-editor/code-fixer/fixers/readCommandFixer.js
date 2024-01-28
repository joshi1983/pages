import { Command } from '../../../../parsing/Command.js';
import { DataType } from '../../../../parsing/data-types/DataType.js';
import { DataTypes } from '../../../../parsing/data-types/DataTypes.js';
import { getTokenTypesBasic } from '../../../../parsing/parse-tree-analysis/variable-data-types/getTokenTypesBasic.js';
import { getTokenValueBasic } from '../../../../parsing/parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { isInstructionList } from '../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';
await Command.asyncInit();

const namesOfInterest = new Set();
const renameMap = new Map();
Command.getAllCommandsInfo().forEach(function(info) {
	if (info.readCommand === undefined || info.args.length !== 1)
		return;
	const readCommand = info.readCommand;
	const readCommandInfo = Command.getCommandInfo(readCommand);
	renameMap.set(readCommandInfo.primaryName, info.primaryName);
	SetUtils.addAll(namesOfInterest, Command.getLowerCaseCommandNameSet(readCommandInfo));
});

function isPossibleDataToken(token) {
	if (!DataType.mayBeData(token.type))
		return false;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined && info.returnTypes === null)
			return false;
	}
	return true;
}

function isOfInterest(token) {
	if (token.children.length !== 0)
		return false;
	if (!namesOfInterest.has(token.val.toLowerCase()))
		return false; // not a translatable read command
	if (!isInstructionList(token.parentNode))
		return false; 
	// calling a command like penColor is fine when it isn't directly in an instruction list.

	const nextSibling = token.nextSibling;
	if (nextSibling === null || !isPossibleDataToken(nextSibling))
		return false;
		// we'll need a parameter value.
		// If there are none, readCommandFixer can't fix anything.

	if (nextSibling.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(nextSibling.val);
		if (info === undefined)
			return false; 
		// We can't be confident enough that readCommandFixer's change will be helpful with procedure calls.
		// Procedure calls make it too hard to know the return types for one thing.
		// changing something like "fillColor p" to "setFillColor p" could easily be
		// unhelpful because the real mistake could just as easily be a forgotten parameter that wasn't at all typed.

		if (info.isIndependentlyUseful === true)
			return false;
			// next sibling is valid in an instruction list.
	}
	const siblingTypes = getTokenTypesBasic(nextSibling, true, {});
	const setCommandInfo = Command.getCommandInfo(renameMap.get(Command.getCommandInfo(token.val).primaryName));
	const requiredTypes = new DataTypes(setCommandInfo.args[0].types);
	if (siblingTypes === undefined)
		return false; 
	// We're not confident enough that readCommandFixer won't introduce a new problem by doing its usual change.

	if (!siblingTypes.hasIntersectionWith(requiredTypes))
		return false; // data types definitely not compatible so don't process the token.

	const tokenValue = getTokenValueBasic(nextSibling);
	if (tokenValue !== undefined) {
		requiredTypes.intersectWithValueCompatability(tokenValue);
		if (requiredTypes.isEmpty())
			return false;
	}
	return true;
}

export function readCommandFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).filter(isOfInterest);
	tokens.forEach(function(token) {
		const readCommandInfo = Command.getCommandInfo(token.val);
		const oldVal = token.val;
		token.val = renameMap.get(readCommandInfo.primaryName);
		cachedParseTree.tokenValueChanged(token, oldVal);
		const nextSibling = token.nextSibling;
		nextSibling.remove();
		token.appendChild(nextSibling);
		fixLogger.log(`Renamed ${oldVal} to ${token.val} because ${oldVal} had no effect.  See command details by clicking <span class="command">${token.val}</span> or <span class="command">${token.val}</span>`, token);
	});
};