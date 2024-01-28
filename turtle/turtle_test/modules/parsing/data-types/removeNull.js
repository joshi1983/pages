export function removeNull(types) {
	if (types === undefined)
		return; // unable to remove 'null' from undefined.
	if (types === 'null' || types === '')
		return '';
	else if (types.endsWith('|null'))
		return types.substring(0, types.length - 5);
	else if (types.startsWith('null|'))
		return types.substring(5);
	else {
		const index = types.indexOf('|null|');
		if (index !== -1)
			return types.substring(0, index) + types.substring(index + 5);
		return types;
	}
};