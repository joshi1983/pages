export function getListOrStringExpressionFromArg(argInfo) {
	if (argInfo.types === 'list')
		return 'The list';
	else if (argInfo.types === 'string')
		return 'The string';
	else if (argInfo.types === 'list|string')
		return 'The list or string';
	else
		return argInfo.name;
};