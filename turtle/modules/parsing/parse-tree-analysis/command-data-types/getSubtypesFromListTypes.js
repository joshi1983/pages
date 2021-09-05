import { DataTypes } from
'../../data-types/DataTypes.js';
import { StringUtils } from
'../../../StringUtils.js';

const intSubtypes = new Set([
	'alphacolorlist', 'colorlist', 'list<int>'
]);

// similar to getMinLenAndSubtypesFromListTypes except not getting minLen.
export function getSubtypesFromListTypes(listTypes, defaultResult) {
	if (intSubtypes.has(listTypes))
		return 'int';
	else {
		if (defaultResult === undefined)
			defaultResult = '*';

		if (listTypes.indexOf('colorlist') === -1) {
			if (listTypes.indexOf('<') === -1 ||
			listTypes.indexOf('>') === -1)
				return defaultResult;

			const count = StringUtils.countChar(listTypes, '<');
			if (count === 1) {
				listTypes = listTypes.substring(listTypes.indexOf('<') + 1);
				const closingIndex = listTypes.lastIndexOf('>');
				if (closingIndex !== -1)
					listTypes = listTypes.substring(0, closingIndex);
				return listTypes;
			}
		}
		const vTypes = new DataTypes(listTypes);
		if (vTypes.types.size === 0)
			return defaultResult;
		else {
			let subTypes = new DataTypes();
			for (const type of vTypes.types) {
				if (type.name.indexOf('colorlist') !== -1)
					subTypes.addTypes(new DataTypes('int'));
				else if (type.name === 'list') {
					subTypes.addTypes(type.subtypes);
				}
			}
			return DataTypes.stringify(subTypes);
		}
	}
}