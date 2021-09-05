import { addFunctionArgList } from './addFunctionArgList.js';

const simplifiers = [
	addFunctionArgList
];

export function simplifyTree(tree) {
	for (const simplify of simplifiers) {
		simplify(tree);
	}
};