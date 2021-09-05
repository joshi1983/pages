import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const invalidTypes = new Set([
ParseTreeTokenType.CURVED_LEFT_BRACKET,
ParseTreeTokenType.CURVED_RIGHT_BRACKET,
]);

function indexOfSecondSemicolon(children) {
	let semicolonCount = 0;
	for (let i = 0; i < children.length; i++) {
		if (children[i].type === ParseTreeTokenType.SEMICOLON) {
			semicolonCount++;
			if (semicolonCount === 2)
				return i;
		}
	}
	return -1; // indicate not found
}

export function getIncrementToken(token) {
	if (token.children.length !== 0) {
		const settings = token.children[0];
		const index = indexOfSecondSemicolon(settings.children);
		if (index > 0) {
			const potentialResult = settings.children[index + 1];
			if (potentialResult !== undefined && !invalidTypes.has(potentialResult.type))
				return potentialResult;
		}
	}
}