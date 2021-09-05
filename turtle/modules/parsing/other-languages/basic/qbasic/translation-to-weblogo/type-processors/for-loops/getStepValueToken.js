import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getStepValueToken(forToken) {
	const children = forToken.children;
	for (let i = 1; i < children.length; i++) {
		const child = children[i];
		if (child.type === ParseTreeTokenType.STEP) {
			const children = child.children;
			return children[0];
		}
	}
}