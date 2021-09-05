import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';

function distanceToClosestExport(token) {
	let result = 1;
	let tok = token.parentNode;
	while (tok !== null && tok.type !== ParseTreeTokenType.EXPORT) {
		result++;
		tok = tok.parentNode;
	};
	if (tok === null)
		return -1;
	return result;
};

export function isFromExportStatement(token) {
	const distance = distanceToClosestExport(token);
	if (distance === -1 || distance > 3)
		return false;
	const parent = token.parentNode;
	if (token.type === ParseTreeTokenType.FUNCTION && parent.type !== ParseTreeTokenType.ASYNC)
		return distance < 2;
	if (token.type === ParseTreeTokenType.CLASS)
		return distance < 2;
	return true;
};