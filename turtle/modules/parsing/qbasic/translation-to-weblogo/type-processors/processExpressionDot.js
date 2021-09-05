import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

export function processExpressionDot(token, result, options) {
	const children = token.children;
	if (children.length !== 3)
		return;

	const objectToken = children[0];
	const propertyToken = children[2];
	if (propertyToken.type !== ParseTreeTokenType.IDENTIFIER)
		return;

	const propertyName = options.identifierRenameMap.get(propertyToken.val.toLowerCase());
	if (objectToken.type !== ParseTreeTokenType.IDENTIFIER) {
		result.append(` getProperty2 ( `);
		processToken(objectToken, result, options);
		result.append(' ) "' + propertyName + ' ');
		return;
	}

	const objectName = options.identifierRenameMap.get(objectToken.val.toLowerCase());
	result.append(` getProperty "${objectName} "${propertyName} `);
};