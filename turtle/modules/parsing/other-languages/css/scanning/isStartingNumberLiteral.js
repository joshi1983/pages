import { isStartingNumberLiteral as jsIsStartingNumberLiteral } from
'../../../other-languages/js-parsing/scanning/isStartingNumberLiteral.js';

export function isStartingNumberLiteral(s) {
	return jsIsStartingNumberLiteral(s);
};