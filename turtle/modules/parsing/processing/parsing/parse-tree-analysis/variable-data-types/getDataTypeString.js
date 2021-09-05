import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { StringBuffer } from
'../../../../../StringBuffer.js';

// The declarationToken should have type ParseTreeTokenType.DECLARATION.
export function getDataTypeString(declarationToken) {
	const dataTypeToken = declarationToken.children[0];
	const result = new StringBuffer();
	let tok = dataTypeToken;
	while (true) {
		if (typeof tok.val === 'string')
			result.append(tok.val);
		if (tok.children.length === 0)
			break;
		tok = tok.children[0];
		if (tok.type === ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR)
			break;
	}
	for (const child of dataTypeToken.children)
		if (child.type === ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR)
			result.append('[]');
	return result.toString();
};