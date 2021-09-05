export function removeListsOverlappingColorLists(types, value) {
	if (!(value instanceof Array) ||
	value.length < 3 || value.length > 4 ||
	value.some(v => !Number.isInteger(v) ||
	v < 0 || v > 255))
		return;

	let colorListFound = false;
	for (const type of types) {
		if (type.name.endsWith('colorlist') ||
		type.name === 'color' ||
		type.name === 'alphacolor') {
			colorListFound = true;
			break;
		}
	}
	if (!colorListFound)
		return;

	for (let i = 0; i < types.length; i++) {
		const type = types[i];
		if (type.name === 'list' &&
		type.subtypes.types.size === 1 &&
		type.minLen === value.length) {
			const subtype = type.subtypes.types.values().next().value;
			if (subtype.name === 'int') {
				types.splice(i, 1); // remove.
				i--; // revisit the same index.
			}
		}
	}
};