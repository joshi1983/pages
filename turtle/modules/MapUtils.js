export class MapUtils {
	static merge(mutatedMap, otherMap) {
		// not using ... operator to be more efficient and 
		// avoid stack overflow when one of the maps is roughly 100,000 elements.
		for (const [key, value] of otherMap) {
			mutatedMap.set(key, value);
		}
	}
};