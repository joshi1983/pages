export function addToLength(lengthInfo, addition) {
	if (Number.isInteger(lengthInfo))
		return lengthInfo + addition;
	else {
		const result = {};
		if (Number.isInteger(lengthInfo.min))
			result.min = Math.max(0, lengthInfo.min + addition);
		else if (addition > 0)
			result.min = addition; // because the minimum before was implicitly 0.

		if (Number.isInteger(lengthInfo.max))
			result.max = Math.max(0, lengthInfo.max + addition);
		return result;
	}
};