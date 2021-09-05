export function butFirstAndButLast(parameterTypes) {
	if (parameterTypes === 'list' || parameterTypes === 'string')
		return parameterTypes;
	if (parameterTypes === undefined)
		return 'list|string';
	if (parameterTypes.indexOf('string') !== -1) {
		if (parameterTypes.indexOf('list') !== -1)
			return 'list|string';
		return 'string';
	}
	if (parameterTypes.indexOf('list') !== -1)
		return 'list';
	return 'list|string';
};