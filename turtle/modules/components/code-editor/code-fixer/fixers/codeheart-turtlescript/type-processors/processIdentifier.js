import { CodeheartTurtleScriptColor } from '../CodeheartTurtleScriptColor.js';
import { Colour } from '../../../../../../Colour.js';
import { fixCodeheartTurtleScriptColorNameForWebLogoVariable } from '../fixCodeheartTurtleScriptColorNameForWebLogoVariable.js';
import { ParseTreeTokenType } from '../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processIdentifier as processIdentifierGeneric } from
'../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/processIdentifier.js';
import { processToken } from './processToken.js';
await Colour.asyncInit();

const processIdentifierConcrete = processIdentifierGeneric(processToken);

function isVariableRead(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DOT)
		return false;
	return true;
}

export function processIdentifier(token, result) {
	if (token.children.length === 0) {
		if (CodeheartTurtleScriptColor.isUniqueToCodeheartTurtleScript(token.val)) {
			result.append(':');
			result.append(fixCodeheartTurtleScriptColorNameForWebLogoVariable(token.val));
			return;
		}
		else if (token.val.toUpperCase() === token.val &&
		Colour.getColourInfoByName(token.val) !== undefined) {
			result.append('"');
		}
		else if (isVariableRead(token))
			result.append(':');
		result.append(token.val);
	}
	else
		processIdentifierConcrete(token, result);
};