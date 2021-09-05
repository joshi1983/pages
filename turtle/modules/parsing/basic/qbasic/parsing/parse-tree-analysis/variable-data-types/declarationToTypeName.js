import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const primitiveToTypeMap = new Map([
	['defdbl', 'double'],
	['defint', 'integer'],
	['deflng', 'long'],
	['defsng', 'single'],
	['defstr', 'string']
]);

export function declarationToTypeName(declarationToken) {
	const parent = declarationToken.parentNode;
	if (parent.type === ParseTreeTokenType.DEF_PRIMITIVE) {
		return primitiveToTypeMap.get(parent.val.toLowerCase());
	}
	const asToken = declarationToken.children.length === 0 ?
		declarationToken.getNextSibling() : declarationToken.children[0];
	if (asToken !== undefined && asToken !== null && asToken.type === ParseTreeTokenType.AS) {
		let typeToken = asToken.children[0];
		if (typeToken !== undefined && typeToken.type === ParseTreeTokenType.DATA_TYPE &&
		typeToken.children.length !== 0) {
			return typeToken.children.map(t => t.val).join(' ').toLowerCase();
		}
	}
};