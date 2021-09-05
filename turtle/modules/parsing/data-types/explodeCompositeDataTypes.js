import { SetUtils } from '../../SetUtils.js';

// types assumed to be a Set of DataType instances
export function explodeCompositeDataTypes(types) {
	const result = new Set();
	for (let type of types) {
		if (type.isUnionOfSubtypes()) {
			SetUtils.addAll(result, type.constructor.getSubtypeSet());
		}
		else
			result.add(type);
	}
	return result;
}