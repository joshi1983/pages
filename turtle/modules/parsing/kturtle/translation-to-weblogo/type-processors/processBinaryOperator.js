import { KTurtleOperators } from '../../KTurtleOperators.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

const operatorToCommands = new Map([
	['^', 'power'],
	['and', 'and'],
	['or', 'or'],
]);

/*
WebLogo's combine command is a good way to concatenate strings with anything.
Ideally, we want to use combine any time any of the values are strings but it 
might be hard to determine that without lots of static code analysis.
*/
function shouldUseCombine(token) {
	if (token.val !== '+' || token.children.length !== 2)
		return false;
	if (token.children.some(c => c.type === ParseTreeTokenType.STRING_LITERAL))
		return true;
	return false;
}

export function processBinaryOperator(token, result) {
	const info = KTurtleOperators.getOperatorInfo(token.val);
	if (shouldUseCombine(token)) {
		result.append('(combine ');
		for (let i = 0; i < token.children.length; i++) {
			const child = token.children[i];
			processToken(child, result);
		}
		result.trimRight();
		result.append(')');
	}
	else if (operatorToCommands.has(token.val)) {
		result.append(`${operatorToCommands.get(token.val)} `);
		for (let i = 0; i < token.children.length; i++) {
			const child = token.children[i];
			processToken(child, result);
		}
	}
	else if (info !== undefined && info.to !== undefined) {
		processToken(token.children[0], result);
		if (!result.endsWithAndNotAcomment(' '))
			result.append(' ');
		result.append(`${info.to} `);
		processToken(token.children[1], result);
	}
	else {
		throw new Error(`Untranslatable operator symbol ${token.val}`);
	}
};