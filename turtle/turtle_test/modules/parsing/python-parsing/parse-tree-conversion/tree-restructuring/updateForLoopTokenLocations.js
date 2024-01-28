import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function updateForLoopTokenLocations(token) {
	if (token.type === ParseTreeTokenType.FOR_LOOP &&
	token.children.length > 0) {
		const forToken = token.children[0];
		token.colIndex = forToken.colIndex;
		token.lineIndex = forToken.lineIndex;
	}
	convertChildren(token, updateForLoopTokenLocations);
};