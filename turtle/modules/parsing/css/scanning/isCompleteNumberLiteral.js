import { isCompleteNumberLiteral as jsIsCompleteNumberLiteral } from
'../../js-parsing/scanning/isCompleteNumberLiteral.js';

export function isCompleteNumberLiteral(s) {
	return jsIsCompleteNumberLiteral(s);
};