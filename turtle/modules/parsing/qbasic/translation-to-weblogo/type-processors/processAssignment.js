import { getMakeCommandNameForToken } from
'./helpers/getMakeCommandNameForToken.js';
import { identifierToWebLogoIdentifier } from
'./helpers/identifierToWebLogoIdentifier.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

export function processAssignment(token, result, options) {
	const children = token.children;
	if (children.length === 2) {
		const firstChild = children[0];
		if (firstChild.type === ParseTreeTokenType.IDENTIFIER) {
			const variableName = identifierToWebLogoIdentifier(firstChild.val);
			const makeName = getMakeCommandNameForToken(token);
			result.append(`${makeName} "${variableName} `);
			processToken(children[1], result, options);
			result.append('\n');
		}
	}
};