import { pathLength } from
'./pathLength.js';

export function pathCutFromStart(path, ratio) {
	if (ratio <= 0)
		return [];

	const length = pathLength(path);
	if (length === 0 || ratio >= 1)
		return path;
	else {
		const result = [];
		let runningLength = 0;
		const goalLength = length * ratio;
		for (const element of path) {
			let elementLength;
			if (element.length === 1) {
				elementLength = Math.abs(element[0]);
			}
			else {
				const angle = element[0];
				const radius = element[1];
				elementLength = Math.abs(radius * angle * Math.PI / 180);
			}
			const newLength = runningLength + elementLength;
			if (newLength <= goalLength) {
				runningLength = newLength;
				result.push(element);
			}
			else {
				if (element.length === 1) {
					result.push([(goalLength - runningLength) * Math.sign(element[0])]);
				} else {
					const radius = element[1];
					const angleDegrees = (goalLength - runningLength) * 
						180 / Math.PI / radius * Math.sign(element[0]);
					result.push([angleDegrees, radius]);
				}
				return result;
			}
		}
		return result;
	}
};