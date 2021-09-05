import { removeUnneededCurvedBrackets } from
'./removeUnneededCurvedBrackets.js';
import { useFasterMathFunctions } from
'./useFasterMathFunctions.js';

const simplifiers = [
	removeUnneededCurvedBrackets,
	useFasterMathFunctions
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