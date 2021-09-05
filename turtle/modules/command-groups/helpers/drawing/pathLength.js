export function pathLength(path) {
	let result = 0;
	for (const element of path) {
		if (element.length === 1)
			result += Math.abs(element[0]);
		else if (element.length === 2) {
			const angle = element[0];
			const radius = element[1];
			result += Math.abs(radius * angle * Math.PI / 180);
		}
	}
	return result;
};