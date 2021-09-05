import { AlphaColour } from
'../../../../AlphaColour.js';
import { Colour } from
'../../../../Colour.js';
import { Transparent } from
'../../../../Transparent.js';
const typesToTranslate = new Set(['boolean', 'number', 'string', 'undefined']);

function isSinglePartValue(o) {
	if (typesToTranslate.has(typeof o) ||
	o === null || o === Transparent || o instanceof Colour ||
	o instanceof AlphaColour)
		return true;
	return false;
}

function countParts(o, limit) {
	if (isSinglePartValue(o))
		return 1;
	if (o instanceof Array || o instanceof Set) {
		let result = 1;
		for (const e of o) {
			result += countParts(e);
		}
		return result;
	}
	if (o instanceof Map) {
		let result = 1;
		for (const key of Array.from(o.keys())) {
			result += countParts(o.get(key));
		}
		return result;
	}
	return 100;
}

function findCycle(o, visitedSet) {
	if (isSinglePartValue(o))
		return false;
	if (visitedSet === undefined)
		visitedSet = new Set([o]);
	else {
		if (visitedSet.has(o))
			return true;
		visitedSet = new Set(visitedSet); // shallow clone
		visitedSet.add(o);
	}
	if (o instanceof Array || o instanceof Set) {
		for (const e of o) {
			if (findCycle(e, visitedSet))
				return true;
		}
	}
	else if (o instanceof Map) {
		for (const key of Array.from(o.keys())) {
			if (findCycle(o.get(key), visitedSet))
				return true;
		}
	}
	return false;
}

export function shouldValueBeTranslatedToJavaScriptCode(value) {
	if (isSinglePartValue(value))
		return true;
	if (findCycle(value))
		return false;
	const countedParts = countParts(value);
	if (countedParts > 20)
		return false;
	return true;
};