import { DataTypes } from './DataTypes.js';

export function removeContainedTypes(types) {
	let optimizedTypes = new Set();
	const sortedTypes = Array.from(types);

	DataTypes.sortBySetSize(sortedTypes);
	if (sortedTypes.length !== 0)
		optimizedTypes.add(sortedTypes[0]);
	for (let i = 1; i < sortedTypes.length; i++) {
		const t = sortedTypes[i];
		if (!DataTypes.contains(optimizedTypes, t)) {
			optimizedTypes.add(t);
		}
	}
	return optimizedTypes;
};