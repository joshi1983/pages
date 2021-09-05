import { processToken } from '../processToken.js';

export function push(token, result, settings) {
	if (token.children.length === 1) {
		result.append(`queue2 "${settings.stackVariableName} `);
		processToken(token.children[0], result, settings);
	}
	else {
		result.append(`;FIXME: unable to translate push instruction because the number of operands was ${token.children.length} when 1 was expected`);
	}
};