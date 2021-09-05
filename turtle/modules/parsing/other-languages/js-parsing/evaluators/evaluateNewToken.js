import { evaluateLiteralToken } from './evaluateLiteralToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function evaluateNewToken(newToken) {
	if (newToken.children.length === 1) {
		const child = newToken.children[0];
		if (child.type !== ParseTreeTokenType.FUNCTION_CALL)
			return;
		const funcNameToken = child.children[0];
		const argList = child.children[1];
		if (funcNameToken.children.length === 0) {
			if (funcNameToken.val === 'Map') {
				if (argList.children.length === 2)
					return new Map();
				if (argList.children.length === 3) {
					const arrayToken = argList.children[1];
					if (arrayToken.type === ParseTreeTokenType.ARRAY_LITERAL) {
						const arrayVal = evaluateLiteralToken(arrayToken);
						if (arrayVal !== undefined)
							return new Map(arrayVal);
					}
				}
			}
			else if (funcNameToken.val === 'Set') {
				if (argList.children.length === 2)
					return new Set();
				if (argList.children.length === 3) {
					const arrayToken = argList.children[1];
					if (arrayToken.type === ParseTreeTokenType.ARRAY_LITERAL) {
						const arrayVal = evaluateLiteralToken(arrayToken);
						if (arrayVal !== undefined)
							return new Set(arrayVal);
					}
				}
			}
		}
	}
};