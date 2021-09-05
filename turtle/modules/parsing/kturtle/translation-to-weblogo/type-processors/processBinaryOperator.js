import { KTurtleOperators } from '../../KTurtleOperators.js';
import { processToken } from '../processToken.js';

const operatorToCommands = new Map([
	['^', 'power'],
	['and', 'and'],
	['or', 'or'],
]);

export function processBinaryOperator(token, result) {
	const info = KTurtleOperators.getOperatorInfo(token.val);
	if (operatorToCommands.has(token.val)) {
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