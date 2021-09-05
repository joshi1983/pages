import { CommandCalls } from
'../../../../parse-tree-analysis/CommandCalls.js';
import { getAllDescendentsAsArray } from
'../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getNextArgToken } from
'../../../../../components/code-editor/code-fixer/fixers/helpers/getNextArgToken.js';
import { getTakenVariableNames } from
'./getTakenVariableNames.js';
import { getTokenValueBasic } from
'../../../../parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { getUniqueIdentifier } from
'../../../../generic-parsing-utilities/getUniqueIdentifier.js';
import { isInProcedure } from
'../../../../parse-tree-analysis/isInProcedure.js';
import { ParseTreeToken } from
'../../../../ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { placeTokensAfter } from
'../../../../generic-parsing-utilities/placeTokensAfter.js';

function getContainingRepeat(token) {
	let prev;
	do {
		prev = token;
		token = token.parentNode;
	} while (token !== null &&
	!CommandCalls.tokenMatchesPrimaryName(token, 'repeat'));
	if (token !== null &&
	token.children[1] !== prev)
		return null;
		// We don't want to handle repAbove if it is in the count argument.
		// repcount and repabove would mean something different in the count argument
		// instead of the instruction list.

	return token;
}

function getCorrespondingRepeat(token, levelsUp) {
	do {
		token = getContainingRepeat(token);
		levelsUp--;
	} while (levelsUp !== -1 && token !== null);
	return token;
}

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'repabove')
		return false;

	const next = getNextArgToken(token);
	if (next === null)
		return false;

	const val = getTokenValueBasic(next);
	if (!Number.isInteger(val) || val < 0)
		return false;

	const repeatToken = getCorrespondingRepeat(token, val);
	return repeatToken !== null;
}

function insertMakeWithRepcount(repeatToken, variableName, cachedParseTree) {
	const instructionList = repeatToken.children[1];
	const inProc = isInProcedure(repeatToken);
	const firstChildOfInstructionList = instructionList.children[0];
	const commandName = inProc ? 'localmake' : 'make';
	const makeToken = new ParseTreeToken(commandName, null,
	firstChildOfInstructionList.lineIndex, firstChildOfInstructionList.colIndex + 1,
	ParseTreeTokenType.PARAMETERIZED_GROUP);
	const variableNameToken = new ParseTreeToken(variableName, null,
	makeToken.lineIndex, makeToken.colIndex + 1,
	ParseTreeTokenType.STRING_LITERAL);
	const repcountToken = new ParseTreeToken('repcount', null,
	variableNameToken.lineIndex, variableNameToken.colIndex + 1,
	ParseTreeTokenType.PARAMETERIZED_GROUP);
	makeToken.appendChild(variableNameToken);
	makeToken.appendChild(repcountToken);
	firstChildOfInstructionList.appendSibling(makeToken);
	const after = makeToken.nextSibling;
	if (after !== null) {
		placeTokensAfter(getAllDescendentsAsArray(after, true), repcountToken);
	}
	cachedParseTree.tokensAdded([makeToken, variableNameToken, repcountToken]);
}

export function repAboveFixer(cachedParseTree, fixLogger) {
	const repAboves = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	if (repAboves.length !== 0) {
		const repcountVariableNames = new Map();
		const takenIdentifiers = getTakenVariableNames(cachedParseTree);
		repAboves.forEach(function(repAbove) {
			const levelsUp = getNextArgToken(repAbove);
			const oldType = repAbove.type;
			const oldVal = repAbove.val;
			const levelsUpVal = getTokenValueBasic(levelsUp);
			levelsUp.remove();
			cachedParseTree.tokenRemoved(levelsUp);
			if (levelsUpVal === 0) {
				// repabove 0 is the same as repcount so just replace that way.
				// It is a weird use of repabove but let's simplify anyway.
				repAbove.val = 'repcount';
				repAbove.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
				fixLogger.log(`Replaced '${oldVal} ${levelsUpVal}' with repcount because WebLogo does not support TurtleSpaces' repAbove command.`, repAbove);
			}
			else {
				const correspondingRepeatToken = getCorrespondingRepeat(repAbove, levelsUpVal);
				let variableName;
				if (repcountVariableNames.has(correspondingRepeatToken))
					variableName = repcountVariableNames.get(correspondingRepeatToken);
				else {
					variableName = getUniqueIdentifier(takenIdentifiers, 'repcount');
					repcountVariableNames.set(correspondingRepeatToken, variableName);
					takenIdentifiers.add(variableName);
					insertMakeWithRepcount(correspondingRepeatToken, variableName, cachedParseTree);
				}
				repAbove.val = variableName;
				repAbove.type = ParseTreeTokenType.VARIABLE_READ;
				fixLogger.log(`Replaced '${oldVal} ${levelsUpVal}' with :${variableName} because WebLogo does not support TurtleSpaces' repAbove command.`, repAbove);
			}
			cachedParseTree.tokenTypeChanged(repAbove, oldType);
		});
	}
};