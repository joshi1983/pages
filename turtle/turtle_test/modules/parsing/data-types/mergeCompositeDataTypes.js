import { AlphaColorType } from './AlphaColorType.js';
import { areDataTypesContaining } from './areDataTypesContaining.js';
import { ColorType } from './ColorType.js';

const alphaColor = new AlphaColorType();
const color = new ColorType();

function containsName(name, types) {
	for (const type of types) {
		if (type.name === name)
			return true;
	}
	return false;
}

function removeTypeNames(namesToRemove, types) {
	namesToRemove = new Set(namesToRemove);
	const typesToRemove = [];
	for (const type of types) {
		if (namesToRemove.has(type.name))
			typesToRemove.push(type);
	}
	typesToRemove.forEach(type => types.delete(type));
}

// types is assumed to be a Set of DataType.
export function mergeCompositeDataTypes(types) {
	if (!(types instanceof Set))
		throw new Error(`types must be a Set.  Not: ${types}`);
	if (areDataTypesContaining(types, alphaColor)) {
		if (!containsName('alphacolor', types)) {
			types.add(alphaColor);
		}
		removeTypeNames(['int', 'alphacolorlist', 'alphacolorstring', 'colorlist', 'colorstring'], types);
	}
	else if (areDataTypesContaining(types, color)) {
		if (!containsName('color', types)) {
			types.add(color);
		}
		removeTypeNames(['int', 'colorlist', 'colorstring'], types);
	}
};