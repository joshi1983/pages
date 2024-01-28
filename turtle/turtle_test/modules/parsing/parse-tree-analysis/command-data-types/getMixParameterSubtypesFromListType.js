import { DataTypes } from '../../data-types/DataTypes.js';
import { TransparentType } from '../../data-types/TransparentType.js';

export function getMixParameterSubtypesFromListType(type, parameterIndex) {
	type = DataTypes.parse(type).values().next().value;
	if (type.subtypes !== undefined && type.subtypes.size !== 0) {
		let resultTypes = new DataTypes('alphacolor|list|num');
		const subtypesString = DataTypes.stringify(type.subtypes);
		if (subtypesString === 'int')
			resultTypes = new DataTypes('alphacolor|num'); // int values can be mixed with both alphacolor and num.
		else
			resultTypes.intersectWith(type.subtypes);
		if (parameterIndex === 1) {
			resultTypes.addTypes(new Set([new TransparentType()]));
		}
		return '<' + DataTypes.stringify(resultTypes) + '>';
	}
	if (parameterIndex === 0)
		return '<alphacolor|list|num>';
	else
		return '<alphacolor|list|num|transparent>';
};