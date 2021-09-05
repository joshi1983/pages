import { Transparent } from '../../Transparent.js';
const safeTypes = new Set(['boolean', 'number', 'string']);

function deepClone(val, maxDepth) {
	if (maxDepth <= 0 || val === Transparent || safeTypes.has(typeof val))
		return val;
	maxDepth--;
	if (val instanceof Array)
		return deepCloneArray(val, maxDepth);
	if (val instanceof Map)
		return deepCloneMap(val, maxDepth);
	return val;
}

function deepCloneArray(array, maxDepth) {
	return array.map(element => deepClone(element, maxDepth - 1));
}

function deepCloneMap(map, maxDepth) {
	const result = new Map();
	for (const [key, value] of map) {
		result.set(key, deepClone(value, maxDepth - 1));
	}
	return result;
}

export function deepCloneVariables(variables) {
	/*
	The maxDepth is to mitigate impact of a cycle in the data structure.
	*/
	return deepCloneMap(variables, 10);
};