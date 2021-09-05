import { Vector } from '../../vector/Vector.js';

export function cylinderToX3D(cylinder, result) {
	const height = Vector.euclideanDistance(cylinder.position.minus(cylinder.endPoint).coords);
	result.append(`<Cylinder radius="${cylinder.radius}" height="${height}" />`);
};