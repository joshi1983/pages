import { Colour } from '../../../../Colour.js';
import { isParameterTokenRequiredToBeColour } from './helpers/isParameterTokenRequiredToBeColour.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

/*
For example, sanitizeColourName('light green') returns 'lightgreen'.
*/
function sanitizeColourName(name) {
	const noSpaces = name.replace(/\s/g, "");
	if (Colour.getColourInfoByName(noSpaces) !== undefined)
		return noSpaces;

	return name;
}

function isOfInterest(token) {
	if (Colour.getColourInfoByName(token.val) !== undefined)
		return false;
	return isParameterTokenRequiredToBeColour(token);
}

/*
requiredColourNameLongStringFixer is similar to colourStringLiteralFixer but not the same.

They're similar in that they both fix tokens that likely represent colours.

colourStringLiteralFixer adds quotes to leaf nodes that can be interpretted as strings.

requiredColourNameLongStringFixer changes the value of existing string literals that are required 
to be colors if they can be fixed with very few changes.
*/
export function requiredColourNameLongStringFixer(cachedParseTree, fixLogger) {
	const tokensToChange = cachedParseTree.getTokensByType(ParseTreeTokenType.LONG_STRING_LITERAL).
		filter(isOfInterest);
	tokensToChange.forEach(function(token) {
		const oldVal = token.val;
		const sanitizedVal = sanitizeColourName(oldVal);
		if (sanitizedVal !== oldVal) {
			token.val = sanitizedVal;
			cachedParseTree.tokenValueChanged(token, oldVal);
			const oldType = token.type;
			if (oldType !== ParseTreeTokenType.STRING_LITERAL) {
				token.type = ParseTreeTokenType.STRING_LITERAL;
				cachedParseTree.tokenTypeChanged(token, oldType);
			}
			fixLogger.log(`Replaced ${oldVal} with ${sanitizedVal} because a color is required and ${oldVal} was not recognized`, token);
		}
	});
}