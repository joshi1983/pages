import { convertFunctionCallsMissingArgListsToIdentifiers } from
'./convertFunctionCallsMissingArgListsToIdentifiers.js';
import { removeUntranslatableDotDotOperators } from
'./removeUntranslatableDotDotOperators.js';

const simplifiers = [
	convertFunctionCallsMissingArgListsToIdentifiers,
	removeUntranslatableDotDotOperators
];

export function simplifyTree(token) {
	for (const simplify of simplifiers) {
		simplify(token);
	}
};