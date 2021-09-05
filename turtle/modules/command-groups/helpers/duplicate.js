export function duplicate(value, duplicateCount) {
	const result = [];
	for (let i = 0; i < duplicateCount; i++) {
		result.push(value);
	}
	return result;
};