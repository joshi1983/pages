import { simplifyForLoopInEnumerate } from './simplifyForLoopInEnumerate.js';

const simplifiers = [
	simplifyForLoopInEnumerate
];

export function simplifyParseTree(root) {
	if (typeof root !== 'object')
		throw new Error(`simplifyParseTree requires an object but found ${root}`);
	if (!(root.children instanceof Array))
		throw new Error(`simplifyParseTree requires root to be an object with a children array but found ${root.children}.  To be more specific, root must be a ParseTreeToken.`);

	for (const simplify of simplifiers)
		simplify(root);
};