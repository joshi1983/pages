import { simplifyTypes } from './simplifyTypes.js';

export function getListOrStringExpressionFromArg(argInfo) {
	const simpleTypes = simplifyTypes(argInfo.types);
	if (simpleTypes === 'list')
		return 'The list';
	else if (argInfo.types === 'string')
		return 'The string';
	else if (argInfo.types === 'list|string')
		return 'The list or string';
	else
		return argInfo.name;
};