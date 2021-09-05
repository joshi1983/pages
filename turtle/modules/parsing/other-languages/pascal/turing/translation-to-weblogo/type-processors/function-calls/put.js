import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { processToken } from
'../processToken.js';

export function put(token, result) {
	const nameToken = token.children[0];
	if (nameToken.children.length === 0) {
		const argList = token.children[1];
		if (argList !== undefined) {
			const args = filterBracketsAndCommas(argList.children);
			for (let i = 0; i < args.length; i++) {
				const commandName = i === args.length - 1 ? 'print' : 'type';
				result.append(`\n${commandName} `);
				processToken(args[i], result);
				result.append('\n');
			}
			return true;
		}
	}
	return false;
};