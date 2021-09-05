import { ArrayUtils } from '../../ArrayUtils.js';

function getDescendentsOfTypesSet(token, types) {
	const result = [];
	if (types.has(token.type))
		result.push(token);
	const children = token.children;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		ArrayUtils.pushAll(result, getDescendentsOfTypesSet(child, types));
	}
	return result;
}

export function getDescendentsOfTypes(token, types) {
	if (types instanceof Array)
		types = new Set(types);
	return getDescendentsOfTypesSet(token, types);
};