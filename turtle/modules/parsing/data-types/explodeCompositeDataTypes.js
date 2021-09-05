import { ColorListType } from './ColorListType.js';
import { ColorStringType } from './ColorStringType.js';
import { ColorType } from './ColorType.js';
import { IntegerType } from './IntegerType.js';

export function explodeCompositeDataTypes(types) {
	const result = new Set();
	for (let type of types) {
		if (type instanceof ColorType) {
			result.add(new ColorStringType());
			result.add(new ColorListType());
			result.add(new IntegerType());
		}
		else
			result.add(type);
	}

	return result;
}