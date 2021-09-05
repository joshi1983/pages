export function optimizeCProcsInDataTypeSet(types) {
	if (!(types instanceof Set))
		throw new Error(`types must be a Set but got ${types}`);
	const cprocTypes = [];
	for (const type of types) {
		if (type.name.startsWith('cproc')) {
			cprocTypes.push(type);
		}
	}
	// try to join any and all ctype instances possible.
	for (let i = 0; i < cprocTypes.length; i++) {
		const ctype1 = cprocTypes[i];
		for (let j = i + 1; j < cprocTypes.length; j++) {
			const ctype2 = cprocTypes[j];
			const unionResult = ctype1.unionWith(ctype2);
			if (unionResult !== undefined) {
				cprocTypes[i] = unionResult;
				types.delete(ctype2);
				types.delete(ctype1);
				types.add(unionResult);
				cprocTypes.splice(j, 1); // remove from the array.
				j--; // Cancel out the j++ from the for-loop.
				// Make it so we'll revisit the same value of j in the next iteration.
				// since we removed cprocTypes[j], keeping j the same will mean 
				// we're visiting a new CProcType instance despite having the same value for j.
			}
		}
	}
};