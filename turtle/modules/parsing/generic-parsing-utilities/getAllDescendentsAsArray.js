import { ArrayUtils } from '../../ArrayUtils.js';

/*
token can be a WebLogo ParseTreeToken, a python-parsing/ParseTreeToken, or generic-parsing-utilities/ParseTreeToken.
The token just needs to be an object with a children Array containing the same type of objects.
*/
export function getAllDescendentsAsArray(token) {
	const result = [];
	// Avoiding forEach method here for slightly better performance.
	const children = token.children;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		const childDescendents = getAllDescendentsAsArray(child);
		result.push(child);
		ArrayUtils.pushAll(result, childDescendents);
	}
	return result;
};