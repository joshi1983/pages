import { isInstructionList } from '../isInstructionList.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const parentTypesToClear = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.LIST,
	ParseTreeTokenType.PARAMETERIZED_GROUP,
	ParseTreeTokenType.UNARY_OPERATOR
]);
function shouldParentTokenBeCleared(parentToken) {
	if (isInstructionList(parentToken))
		return false;
	return parentTypesToClear.has(parentToken.type);
}

export function clearTokenMapAround(tokenMap, fromToken, affectedTokens) {
	let pToken = fromToken.parentNode;
	while (shouldParentTokenBeCleared(pToken)) {
		if (tokenMap.has(pToken))
			affectedTokens.set(pToken, tokenMap.get(pToken));
		tokenMap.delete(pToken);
		pToken = pToken.parentNode;
	}
};