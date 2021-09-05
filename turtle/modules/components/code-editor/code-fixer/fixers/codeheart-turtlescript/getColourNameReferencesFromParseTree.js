import { CodeheartTurtleScriptColor } from './CodeheartTurtleScriptColor.js';
import { Colour } from '../../../../../Colour.js';
import { getDescendentsOfType } from
'../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../../parsing/js-parsing/ParseTreeTokenType.js';
await Colour.asyncInit();

function matchesCodeHeartTurtleScriptVariableNameUniquely(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DOT)
		return false;
	const name = token.val;
	return CodeheartTurtleScriptColor.isUniqueToCodeheartTurtleScript(name);
}

export function getColourNameReferencesFromParseTree(tree) {
	const identifiersOfInterest = getDescendentsOfType(tree, ParseTreeTokenType.IDENTIFIER).
	filter(matchesCodeHeartTurtleScriptVariableNameUniquely);
	const distinctNames = new Set(identifiersOfInterest.map(t => t.val));
	return distinctNames;
};