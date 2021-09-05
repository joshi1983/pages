import { getMakeCommandNameForToken } from
'./helpers/getMakeCommandNameForToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

export function processAssignment(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length === 2) {
		const firstChild = children[0];
		if (firstChild.type === ParseTreeTokenType.IDENTIFIER) {
			const variableName = options.identifierRenameMap.get(firstChild.val.toLowerCase());
			const makeName = getMakeCommandNameForToken(token);
			result.append(`${makeName} "${variableName} `);
			processToken(children[1], result, options);
		}
		else if (firstChild.type === ParseTreeTokenType.EXPRESSION_DOT &&
		firstChild.children.length === 3) {
			const fChildren = firstChild.children;
			const objectNameToken = fChildren[0];
			const propertyNameToken = fChildren[2];
			if (propertyNameToken.type !== ParseTreeTokenType.IDENTIFIER)
				return;

			const propName = options.identifierRenameMap.get(propertyNameToken.val.toLowerCase());
			if (objectNameToken.type !== ParseTreeTokenType.IDENTIFIER) {
				result.append('\nsetProperty2 ( ')
				processToken(objectNameToken, result, options);
				result.append(` ) "${propName} `);
				processToken(children[1], result, options);
				result.append('\n');
				return;
			}

			const objectName = options.identifierRenameMap.get(objectNameToken.val.toLowerCase());
			result.append(`\nsetProperty "${objectName} "${propName} `);
			processToken(children[1], result, options);
		}
		else if (firstChild.type === ParseTreeTokenType.FUNCTION_CALL &&
		firstChild.children.length === 2 &&
		firstChild.children[0].type === ParseTreeTokenType.IDENTIFIER) {
			result.append('\nsetItem ');
			processToken(firstChild.children[1], result, options);
			const variableName = options.identifierRenameMap.get(firstChild.children[0].val.toLowerCase());
			result.append(` "${variableName} `);
			processToken(children[1], result, options);
		}
		result.append('\n');
	}
};