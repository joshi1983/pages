import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';

function getValueToken(tokens) {
	if (tokens.length === 0)
		return;

	const last = tokens[tokens.length - 1];
	if (last.type !== ParseTreeTokenType.COLON)
		return last;
}

function translateUsingOutputCommand(squareCases, result) {
	let numTranslatedIfElse = 0;
	for (let i = 0; i < squareCases.length; i++) {
		let wrapInIfElse = i < squareCases.length - 1;
		const children = squareCases[i].children;
		const conditionToken = children[0];
		const valueToken = getValueToken(children);
		if (valueToken === undefined) {
			result.append(`\n; failed to translate square case because it was invalid JOSS\n`);
		}
		else {
			if (wrapInIfElse) {
				result.append('\nifelse ');
				processToken(conditionToken, result);
				result.append(' [\n');
				numTranslatedIfElse++;
			}
			result.append('output ');
			processToken(valueToken, result);
			if (wrapInIfElse) {
				result.append('\n] [\n');
			}
		}
	}
	if (numTranslatedIfElse > 1) {
		result.append('\n' + (']\n'.repeat(numTranslatedIfElse)));
	}
}

function translateUsingSingleIfElseCommand(squareCases, result) {
	const firstCondition = squareCases[0].children[0];
	const value1 = getValueToken(squareCases[0].children);
	const value2 = getValueToken(squareCases[1].children);
	if (value1 === undefined || value2 === undefined)
		result.append(`\n; failed to translate square bracket expression
; Unable to find the required values\n`);
	else {
		result.append('\nifelse ');
		processToken(firstCondition, result);
		result.append(' ');
		processToken(value1, result);
		result.append(' ');
		processToken(value2, result);
	}
}

export function processSquareBracketExpression(token, result) {
	const squareCases = token.children.filter(c => c.type === ParseTreeTokenType.SQUARE_CASE);
	if (squareCases.length === 2)
		translateUsingSingleIfElseCommand(squareCases, result);
	else
		translateUsingOutputCommand(squareCases, result);
};