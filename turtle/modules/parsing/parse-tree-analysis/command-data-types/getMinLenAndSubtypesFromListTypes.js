import { DataTypes } from
'../../data-types/DataTypes.js';

const intSubtypes = new Set([
	'alphacolorlist', 'colorlist', 'list<int>'
]);

export function getMinLenAndSubtypesFromListTypes(listTypes) {
	let subtypes = 'int';
	let resultMinLen = 0;
	if (!intSubtypes.has(listTypes)) {
		const vTypes = new DataTypes(listTypes);
		if (vTypes.types.size === 0)
			return 'list<num>';
		else {
			resultMinLen = Infinity;
			let subTypes = new DataTypes();
			for (const type of vTypes.types) {
				if (type.name === 'colorlist')
					resultMinLen = Math.min(3, resultMinLen);
				else if (type.name === 'alphacolorlist')
					resultMinLen = Math.min(4, resultMinLen);
				else if (type.name === 'list') {
					resultMinLen = Math.min(type.minLen, resultMinLen);
					subTypes.addTypes(type.subtypes);
				}
			}
			subtypes = DataTypes.stringify(subTypes);
		}
	}
	return [resultMinLen, subtypes];
}