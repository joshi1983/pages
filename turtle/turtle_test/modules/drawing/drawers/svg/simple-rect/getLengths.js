import { Vector } from '../../../vector/Vector.js';

export function getLengths(elements) {
	if (!(elements instanceof Array))
		throw new Error(`elements must be an Array.  Not: ${elements}`);
	const lengths = [];
	let length = 0;

	for (let i = 1; i < elements.length; i++) {
		const displacement = elements[i].minus(elements[i - 1]);
		const len = Vector.euclideanDistance(displacement.coords);
		lengths.push(len);
		length += len;
	}
	if (lengths.length === 3) {
		const displacement = elements[3].minus(elements[0]);
		const len = Vector.euclideanDistance(displacement.coords);
		lengths.push(len);
		length += len;
	}
	return {'lengths': lengths, 'length': length};
};