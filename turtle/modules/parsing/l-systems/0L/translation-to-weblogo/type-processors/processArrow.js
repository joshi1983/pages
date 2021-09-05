import { processToken } from './processToken.js';

export function processArrow(token, result) {
	const children = token.children;
	const firstChild = children[0];
	const commandSequence = children[1];
	result.append(`\nto ${firstChild.val}\n`);

	if (commandSequence !== undefined) {
		for (const commandSymbol of commandSequence.children) {
			processToken(commandSymbol, result);
		}
	}

	result.append('\nend\n');
};