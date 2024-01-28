import { BooleanType } from './BooleanType.js';
import { DataListType } from './DataListType.js';
import { NumberType } from './NumberType.js';
import { StringType } from './StringType.js';
import { TupleType } from './TupleType.js';

export class DataTypes {
	static explodedTypesArray = [
		new BooleanType(),
		new DataListType(),
		new NumberType(),
		new StringType(),
		new TupleType()
	];
	static typesMap = new Map();

	constructor(types) {
		if (typeof types === 'string')
			types = DataTypes.parse(types);
		else if (types instanceof Array)
			types = new Set(types);
	
		if (types instanceof Set)
			this.types = types;
		else if (types === undefined || types === null)
			this.types = new Set(); // initialize empty
		else
			throw new Error(`Unrecognized value passed to DataTypes constructor: ${types}.  typeof types = ${typeof types}`);
	}

	/*
	name must be a single data-type's name.  createFromName does not handle "|" operators.
	*/
	static createFromName(name) {
		name = name.trim().toLowerCase();
		if (!DataTypes.typesMap.has(name))
			throw new Error('Unable to find type for name ' + name);
		return DataTypes.typesMap.get(name);
	}

	static getAllAssignableDataTypes() {
		return new Set(DataTypes.explodedTypesArray);
	}

	static getTypesCompatibleWithValue(value) {
		let resultTypes = DataTypes.explodedTypesArray.filter(t => t.mayBeCompatibleWithValue(value));
		return new DataTypes(resultTypes);
	}

	static parse(dataTypeString) {
		if (dataTypeString === '*')
			return DataTypes.getAllAssignableDataTypes();
		else
			dataTypeString = dataTypeString.split('|').filter((s) => s !== '');
		return new Set(dataTypeString.map(function(name) {
			return DataTypes.createFromName(name);
		}));
	}

	static stringify(typeSet) {
		if (typeSet instanceof DataTypes)
			typeSet = new Set(typeSet.types);
		if (typeSet instanceof Set)
			typeSet = Array.from(typeSet);
		else if (!(typeSet instanceof Array))
			throw new Error(`DataTypes, Set, or Array expected.  typeSet=${typeSet}`);

		const result = typeSet.map(function(type) {
			return type.toString();
		});
		result.sort();
		return result.join('|');
	}
};

DataTypes.explodedTypesArray.forEach(function(dataType) {
	DataTypes.typesMap.set(dataType.name, dataType);
});