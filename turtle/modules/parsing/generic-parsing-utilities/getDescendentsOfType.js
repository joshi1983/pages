import { ArrayUtils } from '../../ArrayUtils.js';

export function getDescendentsOfType(token, type) {
	const result = [];
	if (token.type === type)
		result.push(token);
	for (let i = 0; i < token.children.length; i++) {
		const results = getDescendentsOfType(token.children[i], type);
		ArrayUtils.pushAll(result, results);
	}
	return result;
};