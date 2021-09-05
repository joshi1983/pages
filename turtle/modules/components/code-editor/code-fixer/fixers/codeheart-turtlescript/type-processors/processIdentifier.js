import { CodeheartTurtleScriptColor } from '../CodeheartTurtleScriptColor.js';
import { Colour } from '../../../../../../Colour.js';
import { fixCodeheartTurtleScriptColorNameForWebLogoVariable } from '../fixCodeheartTurtleScriptColorNameForWebLogoVariable.js';
import { ParseTreeTokenType } from '../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processInGeneral } from './processInGeneral.js';
import { processUnaryOperator } from './processUnaryOperator.js';
await Colour.asyncInit();

const identifiersToWebLogo = new Map([
	['Math.PI', 'pi'],
]);
// It would be nice to iterate over the Math object to 
Object.getOwnPropertyNames(Math).forEach(function(key) {
	const key2 = 'Math.' + key;
	if (typeof Math[key] === 'number' &&
	!identifiersToWebLogo.has(key2)) {
		identifiersToWebLogo.set(key2, Math[key]);
	}
});

function isVariableRead(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DOT)
		return false;
	return true;
}

export function processIdentifier(token, result) {
	if (token.children.length !== 0) {
		if (token.children.length === 1) {
			if (token.children[0].type === ParseTreeTokenType.UNARY_OPERATOR) {
				processUnaryOperator(token.children[0], result);
			}
			else {
				let fullIdentifierPath = token.val;
				for (let tok = token.children[0]; tok !== undefined; tok = tok.children[0]) {
					fullIdentifierPath += tok.val;
				}
				if (identifiersToWebLogo.has(fullIdentifierPath)) {
					const toValue = identifiersToWebLogo.get(fullIdentifierPath);
					result.append('' + toValue);
					return;
				}
				processInGeneral(token, result);
			}
		}
	}
	else {
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
};