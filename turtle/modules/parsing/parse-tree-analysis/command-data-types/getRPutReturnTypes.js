import { DataListType } from
'../../data-types/DataListType.js';
import { DataTypes } from
'../../data-types/DataTypes.js';
import { IntegerType } from
'../../data-types/IntegerType.js';

const intType = new IntegerType();

export function getRPutReturnTypes(elementTypes, listTypes) {
	if (listTypes === 'list' || elementTypes === '*' ||
	elementTypes === null)
		return 'list(minlen=1)';

	if (listTypes.indexOf('<') !== -1 ||
	listTypes.indexOf('minlen') !== -1) {
		const listDTypes = DataTypes.parse(listTypes);
		let previousMinLen;
		let subtypes = DataTypes.parse(elementTypes);
		for (const type of listDTypes) {
			if (type.name.endsWith('list') ||
			type.name.indexOf('color') !== -1) {
				let len;
				if (type.name === 'list') {
					subtypes = DataTypes.union(type.subtypes.types, subtypes);
					len = type.minLen;
				}
				else {
					subtypes = DataTypes.union(subtypes, new Set([intType]));
					len = type.name.startsWith('color') ? 3 : 4;
				}
				if (previousMinLen === undefined)
					previousMinLen = len;
				else
					previousMinLen = Math.min(previousMinLen, len);
			}
		}
		return new DataListType(subtypes, 1 + previousMinLen).toString();
	}

	return 'list(minlen=1)';
};