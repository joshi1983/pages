export function getUniqueIdentifier(takenIdentifiers, prefix) {
	if (prefix === undefined)
		prefix = '_';
	else if (typeof prefix !== 'string')
		throw new Error(`prefix must either be a string or left undefined but found ${prefix}`);

	for (let i = 1; true; i++) {
		const newName = `${prefix}${i}`;
		if (!takenIdentifiers.has(newName))
			return newName;
	}
};