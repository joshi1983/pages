import { filterAllBracketsAndCommas } from
'../../../new-translation-to-weblogo/type-processors/helpers/filterAllBracketsAndCommas.js';
import { filterBracketsAndCommas } from
'../../../new-translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { getTokenValue } from
'./getTokenValue.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function len(vals) {
	if (vals.length !== 1)
		return;
	const listVal = vals[0];
	if (!(listVal instanceof Array))
		return;
	return listVal.length;
}

const funcs = new Map([
	['len', len]
]);

export function getFunctionCallValue(token, tokenToValueMap) {
	const name = token.val;
	if (!funcs.has(name))
		return; // indicate not run.

	const argList = token.children[0];
	if (argList === undefined)
		return;

	const argTokens = filterBracketsAndCommas(argList.children);
	if (name === 'len' && argTokens.length === 1) {
		const first = argTokens[0];
		if (first.type === ParseTreeTokenType.LIST_LITERAL ||
		first.type === ParseTreeTokenType.TUPLE_LITERAL)
			return filterAllBracketsAndCommas(first.children).length;
	}
	const vals = argTokens.map(t => getTokenValue(t, tokenToValueMap));
	const func = funcs.get(name);
	return func(vals);
};