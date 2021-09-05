import { StringBuffer } from
'../../../../../StringBuffer.js';

function toString(token, buffer) {
	if (typeof token.val === 'string')
		buffer.append(token.val);
	for (const child of token.children) {
		toString(child, buffer);
	}
}

export function getDataTypeStringFromTypeToken(typeToken) {
	const result = new StringBuffer();
	toString(typeToken, result);
	return result.toString();
}

// The declarationToken should have type ParseTreeTokenType.DECLARATION.
export function getDataTypeString(declarationToken) {
	const dataTypeToken = declarationToken.children[0];
	return getDataTypeStringFromTypeToken(dataTypeToken);
};