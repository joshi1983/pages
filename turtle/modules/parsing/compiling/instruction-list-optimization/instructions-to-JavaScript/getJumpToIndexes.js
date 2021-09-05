function compareNumbers(num1, num2) {
	return num1 - num2;
}

export function getJumpToIndexes(instructions) {
	const indexes = new Set();
	instructions.forEach(function(instruction) {
		if (instruction.jumpToIndex !== undefined) {
			indexes.add(instruction.jumpToIndex);
		}
	});
	const result = Array.from(indexes);
	result.sort(compareNumbers);
	return result;
};