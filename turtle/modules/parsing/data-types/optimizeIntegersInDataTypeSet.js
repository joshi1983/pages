export function optimizeIntegersInDataTypeSet(types) {
	if (!(types instanceof Set))
		throw new Error(`types must be a Set but got ${types}`);
	let continueOptimizing = true;
	while (continueOptimizing) {
		continueOptimizing = false;
		const intTypes = [];
		const toRemove = [];
		for (const type of types) {
			if (type.name === 'int' &&
			(Number.isFinite(type.min) || Number.isFinite(type.max))) {
				let somethingRemoved = false;
				for (const prev of intTypes) {
					if (prev.min === type.min ||
					prev.max === type.min) {
						toRemove.push(type); // prev already contains type so type is redundant.
						prev.min = Math.min(prev.min, type.min);
						prev.max = Math.max(prev.max, type.max);
						somethingRemoved = true;
						break;
					}
					else if (type.min - prev.max === 1) {
						type.min = prev.min; // expand type to contain prev.
						type.max = Math.max(type.max, prev.max);
						toRemove.push(prev);
						somethingRemoved = true;
						break;
					}
					else if (prev.min - type.min === 1) {
						prev.min = type.min; // expand prev to include type.
						prev.max = Math.max(type.max, prev.max);
						toRemove.push(type);
						somethingRemoved = true;
						break;
					}
				}
				if (!somethingRemoved)
					intTypes.push(type);
			}
		}
		continueOptimizing = toRemove.length !== 0;
		for (const e of toRemove) {
			types.delete(e);
		}
	}
};