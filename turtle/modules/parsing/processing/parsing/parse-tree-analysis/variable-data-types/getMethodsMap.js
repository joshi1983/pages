import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { Method } from '../Method.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getMethodsMap(root) {
	if (typeof root !== 'object')
		throw new Error(`root must be an object but got ${root}`);
	if (root.parentNode !== null)
		throw new Error(`root.parentNode must be null but got ${root.parentNode}`);
	const methodTokens = getDescendentsOfType(root,
		ParseTreeTokenType.METHOD).filter(m =>
			m.children.length >= 2 &&
			typeof m.children[1].val === 'string'
		);
	const result = new Map();
	for (const methodToken of methodTokens) {
		const method = new Method(methodToken);
		const name = method.name;
		let val = result.get(name);
		if (val === undefined) {
			val = [];
			result.set(name, val);
		}
		val.push(method);
	}
	return result;
};