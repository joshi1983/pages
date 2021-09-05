import { isStartingNumberLiteral as jsIsStartingNumberLiteral } from
'../../js-parsing/scanning/isStartingNumberLiteral.js';

export function isStartingNumberLiteral(s) {
	return jsIsStartingNumberLiteral(s);
};