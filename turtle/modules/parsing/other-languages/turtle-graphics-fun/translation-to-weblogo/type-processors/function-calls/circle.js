import { evaluateLiteralToken } from
'../../../../js-parsing/evaluators/evaluateLiteralToken.js';
import { filterBracketsAndCommas } from
'../../../../js-parsing/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { processToken } from
'../../../../js-parsing/translation-to-weblogo/type-processors/processToken.js';

export function isCircleApplicableTo(token) {
	const argList = token.children[1];
	const args = filterBracketsAndCommas(argList.children);
	return args.length > 1;
}

export function circle(token, result, options) {
	const argList = token.children[1];
	const args = filterBracketsAndCommas(argList.children);
	const directionArg = args[2];
	let isClockwise;
	if (directionArg === undefined) 
		isClockwise = true;
	else {
		const directionVal = evaluateLiteralToken(directionArg);
		if (typeof directionVal === 'boolean') {
			isClockwise = directionVal;
		}
		else
			isClockwise = undefined;
	}
	let commandName = 'tgfCircle_2';
	if (isClockwise === undefined)
		commandName = 'tgfCircle_3'; // a procedure

	result.append(`\n${commandName} `);
	if (isClockwise === undefined) {
		for (let i = 0; i < 3; i++) {
			const arg = args[i];
			processToken(arg, result, options);
		}
	}
	else {
		processToken(args[0], result, options);
		if (isClockwise === false)
			result.append(' -');
		processToken(args[1], result, options);
	}
};