import { getDistinctVariableNameDeclared } from
'./getDistinctVariableNameDeclared.js';
import { processToken } from '../processToken.js';

export function lineTo(token, result, settings) {
	const pointName = getDistinctVariableNameDeclared(token, result, 'p', settings);
	const argList = token.children[1];
	result.append('[');
	processToken(argList, result, settings);
	result.append(']\n');
	result.append(`setHeading towards :${pointName}\n`);
	result.append(`forward distance :${pointName}\n`);
};