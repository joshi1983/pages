import { removeUnneededCurvedBrackets } from
'./removeUnneededCurvedBrackets.js';

const simplifiers = [
	removeUnneededCurvedBrackets
];

export function simplify(root) {
	let continueSimplifying = true;
	while (continueSimplifying) {
		continueSimplifying = false;
		for (const simplifier of simplifiers) {
			if (simplifier(root) === true)
				continueSimplifying = true;
		}
	}
};