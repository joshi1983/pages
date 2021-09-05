import { SetUtils } from '../../SetUtils.js';

export function explodeDisconnectedDataTypes(types) {
	const result = new Set();
	for (let type of types) {
		if (type.isUnionOfSubtypes()) {
			SetUtils.addAll(result, type.constructor.getDisconnectedSubtypeSet());
		}
		else if (typeof type.constructor.getSubtypeSet === 'function') {
			SetUtils.addAll(result, type.constructor.getSubtypeSet());
			result.add(type);
		}
		else
			result.add(type);
	}

	return result;
}