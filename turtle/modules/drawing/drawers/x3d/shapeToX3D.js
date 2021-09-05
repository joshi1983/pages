import { circleToX3D } from './circleToX3D.js';
import { cylinderToX3D } from './cylinderToX3D.js';
import { shapeStyleToX3D } from './shapeStyleToX3D.js';
import { sphereToX3D } from './sphereToX3D.js';
import { StringUtils } from '../../../StringUtils.js';
import { textToX3D } from './textToX3D.js';

function converterToShapeConstructorName(converter) {
	let name = StringUtils.capitalizeFirstLetter(converter.name);
	name = name.substring(0, name.length - 'ToX3D'.length) + 'Shape';
	return name;
}

const convertersMap = new Map();
[circleToX3D, cylinderToX3D, sphereToX3D, textToX3D].forEach(function(converter) {
	convertersMap.set(converterToShapeConstructorName(converter), converter);
});

export function shapeToX3D(shape, result) {
	const pos = shape.position.coords;
	result.append(`<Transform translate="${pos[0]} ${pos[1]} ${pos[2]}">`);
	shapeStyleToX3D(shape.style, result);
	const converter = convertersMap.get(shape.constructor.name);
	if (converter === undefined)
		throw new Error(`Unable to find converter for a shape with constructor name ${shape.constructor.name}`);
	converter(shape, result);
	result.append('</Transform>');
};