import { getNextArgToken } from './getNextArgToken.js';

/*
This simulates what modules/parsing/createParameterizedGroups.js does.

This works a bit differently because the parse tree already parsed.
This has to work with a wider number of cases.
*/
export function moveArgsForParameterizedGroup(token, expectedArgCount) {
	let next;
	while (token.children.length < expectedArgCount && (next = getNextArgToken(token)) !== null) {
		next.remove();
		token.appendChild(next);
	}
};