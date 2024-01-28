import { DataListType } from '../../../data-types/DataListType.js';
import { DataTypes } from '../../../data-types/DataTypes.js';
import { getTokenTypesBasic } from
'../getTokenTypesBasic.js';
await DataTypes.asyncInit();

export function getDataTypesForListTokenBasic(token, isStrict, extraInfo) {
	if (token.children.length > 2) {
		const subtypes = new DataTypes();
		for (let i = 0; i < token.children.length; i++) {
			const child = token.children[i];
			if (!child.isBracket()) {
				const types = getTokenTypesBasic(child, isStrict, extraInfo);
				if (types === undefined)
					return new DataTypes('list');
				subtypes.addTypes(types);
			}
		}
		return new DataTypes(new Set([new DataListType(subtypes)]));
	}
	return new DataTypes('list');
};