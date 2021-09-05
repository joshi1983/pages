export function lput(thing, list1) {
	const result = list1.slice(0);
	result.push(thing);
	return result;
};