export function shouldValueBeCloned(val) {
	return val instanceof Array || val instanceof Map;
};