import { getClosestOfTypes } from
'../../../../../../generic-parsing-utilities/getClosestOfTypes.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function quit(token, result) {
	const nameToken = token.children[0];
	if (nameToken.children.length === 0) {
		const functionAncestor = getClosestOfTypes(token, [
			ParseTreeTokenType.FUNCTION,
			ParseTreeTokenType.PROCEDURE
		]);
		if (functionAncestor !== null) {
			result.append('\nstop ; Review this for differences.  Turing\'s quit quits the whole program.');
			result.append('\n; stop is WebLogo\'s closest analogue but it only quits out of the current procedure.');
		}
		else {
			const loopAncestor = getClosestOfTypes(token, [
				ParseTreeTokenType.FOR,
				ParseTreeTokenType.LOOP
			]);
			if (loopAncestor !== null) {
				result.append('\nbreak ; Review this for differences.\n');
				result.append('; Turing\'s quit exits the whole program.\n');
				result.append('; WebLogo\'s break just quits the current loop.\n');
			}
		}
		return true;
	}
	else
		return false;
};