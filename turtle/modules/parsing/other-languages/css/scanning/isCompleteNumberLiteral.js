import { isCompleteNumberLiteral as jsIsCompleteNumberLiteral } from
'../../../other-languages/js-parsing/scanning/isCompleteNumberLiteral.js';

export function isCompleteNumberLiteral(s) {
	return jsIsCompleteNumberLiteral(s);
};