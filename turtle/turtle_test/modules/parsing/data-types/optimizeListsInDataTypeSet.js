import { DataTypes } from './DataTypes.js';

export function optimizeListsInDataTypeSet(types) {
	if (!(types instanceof Set))
		throw new Error(`types must be a Set but got ${types}`);
	const listTypes = [];
	const subtypes = new DataTypes();
	let firstList;
	let allSubtypes = false;
	const toRemove = [];
	for (const type of types) {
		if (type.name === 'list') {
			if (firstList === undefined)
				firstList = type;
			else
				toRemove.push(type);
			listTypes.push(type);
			if (type.subtypes === undefined)
				allSubtypes = true;
			else if (type.subtypes.types === undefined) {
				console.error('type = ', type);
				throw new Error(`Weird!`);
			}
			else
				subtypes.addTypes(type.subtypes.types);
		}
	}
	if (firstList === undefined)
		return; // nothing to do.
	if (allSubtypes) {
		firstList.subtypes = undefined;
	}
	else {
		firstList.subtypes = subtypes;
	}
	for (let i = 0; i < toRemove.length; i++)
		types.delete(toRemove[i]);
};