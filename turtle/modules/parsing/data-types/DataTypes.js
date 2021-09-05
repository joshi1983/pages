import { AlphaColorType } from './AlphaColorType.js';
import { areDataTypesContaining } from './areDataTypesContaining.js';
import { BooleanType } from './BooleanType.js';
import { ColorListType } from './ColorListType.js';
import { ColorStringType } from './ColorStringType.js';
import { ColorType } from './ColorType.js';
import { CProcType } from './CProcType.js';
import { DataListType } from './DataListType.js';
import { DataType } from './DataType.js';
import { EasingType } from './EasingType.js';
import { explodeCompositeDataTypes } from './explodeCompositeDataTypes.js';
import { explodeDisconnectedDataTypes } from './explodeDisconnectedDataTypes.js';
import { GradientType } from './GradientType.js';
import { InstructionListType } from './InstructionListType.js';
import { IntegerType } from './IntegerType.js';
import { asyncInit as isDataTypeContainingAsyncInit, isDataTypeContaining }
from './isDataTypeContaining.js';
import { isSingleDataTypeContainingTypes } from './isSingleDataTypeContainingTypes.js';
import { mergeCompositeDataTypes } from './mergeCompositeDataTypes.js';
import { NumberType } from './NumberType.js';
import { optimizeListsInDataTypeSet } from './optimizeListsInDataTypeSet.js';
import { parseDataTypeString } from './data-type-parsing/parseDataTypeString.js';
import { removeContainedTypes } from './removeContainedTypes.js';
import { PropertyListType } from './PropertyListType.js';
import { StringType } from './StringType.js';
import { TransparentType } from './TransparentType.js';

async function asyncInit() {
	await ColorStringType.asyncInit();
	await isDataTypeContainingAsyncInit();
	DataTypes.typesArray = [
		new AlphaColorType(),
		new BooleanType(),
		new ColorListType(),
		new ColorStringType(),
		new ColorType(),
		new CProcType(),
		new DataListType(),
		new EasingType(),
		new GradientType(),
		new IntegerType(),
		new InstructionListType(),
		new NumberType(),
		new PropertyListType(),
		new StringType(),
		new TransparentType()
	];
	DataTypes.explodedTypesArray = Array.from([
		...explodeCompositeDataTypes(new Set(DataTypes.typesArray)), 
		...DataTypes.typesArray.filter(t => t.isUnionOfSubtypes())]);
	DataTypes.explodedTypesArray.forEach(function(type) {
			DataTypes.typesMap.set(type.name, type);
		});
}
const initPromise = asyncInit();

export class DataTypes {
	static asyncInit() {
		return initPromise;
	}

	static typesArray = undefined;
	static explodedTypesArray = undefined;
	static typesMap = new Map();

	constructor(types) {
		if (types instanceof DataTypes)
			types = types.types;
		else if (types instanceof Array)
			types = new Set(types);
		else if (typeof types === 'string') {
			this.loadFromString(types);
			return;
		}
		if (types instanceof Set) {
			this.types = types;
			this.optimize();
		}
		else if (types === undefined || types === null)
			this.types = new Set(); // initialize empty
		else
			throw new Error('DataTypes instance, string, Set, Array, null or undefined are acceptable but not ' + types);
	}

	addTypes(otherDataTypes) {
		if (otherDataTypes instanceof DataTypes)
			otherDataTypes = otherDataTypes.types;
		else if (otherDataTypes instanceof Array)
			otherDataTypes = new Set(otherDataTypes);
		else if (otherDataTypes === undefined)
			throw new Error(`otherDataTypes must not be undefined`);

		this.types = DataTypes.union(this.types, otherDataTypes);
		this.optimize();
	}

	/*
	Checks if dataTypes contains otherTypeOrTypes.
	In other words, is otherTypeOrTypes a subset of dataTypes?
	*/
	static contains(dataTypes, otherTypeOrTypes) {
		return areDataTypesContaining(dataTypes, otherTypeOrTypes);
	}

	/*
	name must be a single data-type's name.  createFromName does not handle "|" operators.
	*/
	static createFromName(name) {
		name = name.trim().toLowerCase();
		if (!DataTypes.typesMap.has(name)) {
			if (name.startsWith('cproc:'))
				return CProcType.parseName(name);
			throw new Error('Unable to find type for name ' + name);
		}
		return DataTypes.typesMap.get(name);
	}

	deepClone() {
		return new DataTypes(Array.from(this.types));
	}

	// assumes this and other are optimized prior to calling equals method.
	// If this assumption is violated, the method may return incorrect results.
	// This assumption is used to help equals perform faster.
	equals(other) {
		if (!(other instanceof DataTypes))
			return false;

		// Assumes this and other are optimized() since last mutation.
		if (this.types.size !== other.types.size)
			return false;
		return this.toString() === other.toString();
	}

	static getAllAssignableDataTypes() {
		return new Set(DataTypes.getAssignableTypesArray());
	}

	static getAllTypesString() {
		if (DataTypes.allTypesString === undefined) {
			const s = Array.from(DataTypes.getAllAssignableDataTypes()).
				filter(t => t.name !== 'color' && t.name !== 'alphacolor');
			DataTypes.allTypesString = DataTypes.stringify(s);
		}
		return DataTypes.allTypesString;
	}

	static getAssignableTypesArray() {
		return DataTypes.getTypesArray().filter((dt) => dt.name !== 'instructionlist');
	}

	static getTypesArray() {
		return Array.from(DataTypes.typesMap.values());
	}

	static getTypesCompatibleWithValue(val, extraInfo) {
		if (extraInfo === undefined)
			extraInfo = {};
		let resultTypes = DataTypes.explodedTypesArray.filter(t => t.mayBeCompatibleWithValue(val, extraInfo)).
		map(function(type) {
			if (type.tightenForValue === undefined)
				return type;
			else
				return type.tightenForValue(val, extraInfo);
		});
		// remove any supersets.
		resultTypes = resultTypes.filter(t => !resultTypes.some(other => other.isProperSubsetOf(t, DataTypes)));
		return new DataTypes(resultTypes);
	}

	getTypesContaining(types) {
		if (types instanceof DataTypes)
			types = types.types;
		const result = new DataTypes();
		for (const type of this.types) {
			if (isSingleDataTypeContainingTypes(type, types))
				result.types.add(type);
		}
		return result;
	}

	hasIntersectionWith(otherTypes) {
		const testTypes = this.deepClone();
		testTypes.intersectWith(otherTypes);
		return !testTypes.isEmpty();
	}

	static intersect(typeSet1, typeSet2) {
		if (!(typeSet1 instanceof Set))
			throw new Error('typeSet1 must be a Set');
		if (!(typeSet2 instanceof Set))
			throw new Error('typeSet2 must be a Set');
		typeSet1 = explodeCompositeDataTypes(typeSet1);
		typeSet2 = explodeCompositeDataTypes(typeSet2);
		var result = new Set();
		for (var t1 of typeSet1) {
			if (typeof t1.getIntersectionWith !== 'function') {
				console.error('t1 = ', t1);
				throw new Error('t1 must implement getIntersectionWith');
			}
			const t1Intersection = new Set();
			for (var t2 of typeSet2) {
				var t1t2 = t1.getIntersectionWith(t2, DataTypes.createFromName);
				if (t1t2 !== null)
					t1Intersection.add(t1t2);
			}
			result = DataTypes.union(t1Intersection, result);
		}
		return result;
	}

	intersectWith(otherDataTypes) {
		if (otherDataTypes instanceof DataTypes)
			otherDataTypes = otherDataTypes.types;
		else if (otherDataTypes instanceof Array)
			otherDataTypes = new Set(otherDataTypes);

		this.types = DataTypes.intersect(this.types, otherDataTypes);
		this.optimize();
	}

	intersectWithValueCompatability(val) {
		if (val === undefined)
			throw new Error('intersectWithValueCompatibility should not be called with undefined');
		const typeSet = explodeDisconnectedDataTypes(this.types);
		const newTypeSet = new Set();
		for (let type of typeSet) {
			if (type.mayBeCompatibleWithValue(val)) {
				if (type.tightenForValue === undefined)
					newTypeSet.add(type);
				else
					newTypeSet.add(type.tightenForValue(val));
			}
		}
		this.types = newTypeSet;
		this.optimize();
	}

	isEmpty() {
		return this.types.size === 0;
	}

	static isMoreSpecific(type1, type2) {
		return DataTypes.contains(type2, type1);
	}

	// s could be something like 'bool|num'.
	loadFromString(s) {
		if (typeof s !== 'string')
			throw new Error('s must be a string');

		this.types = DataTypes.parse(s);
		this.optimize();
	}

	mayBeCompatibleWith(token) {
		for (let item of this.types)
			if (item.mayBeCompatibleWith(token))
				return true;
		return false;
	}

	optimize() {
		let optimizedTypes = removeContainedTypes(this.types);
		if (DataTypes.contains(optimizedTypes, new AlphaColorType())) {
			let canSimplifyWithAlphaColor = true;
			let optimizedTypeNames = new Set();
			optimizedTypes.forEach(t => optimizedTypeNames.add(t.name));
			const colorSubTypeNames = ['alphacolorstring', 'alphacolorlist'];
			colorSubTypeNames.forEach(function(typeName) {
				if (!optimizedTypeNames.has(typeName))
					canSimplifyWithAlphaColor = false;
			});
			colorSubTypeNames.push('int');
			colorSubTypeNames.push('alphacolor');
			optimizedTypes = new Set(Array.from(optimizedTypes).filter(t => colorSubTypeNames.indexOf(t.name) === -1));
			optimizedTypes.add(new AlphaColorType());
		}
		else if (DataTypes.contains(optimizedTypes, new ColorType())) {
			let canSimplifyWithColor = true;
			let optimizedTypeNames = new Set();
			optimizedTypes.forEach(t => optimizedTypeNames.add(t.name));
			const colorSubTypeNames = ['colorstring', 'colorlist'];
			colorSubTypeNames.forEach(function(typeName) {
				if (!optimizedTypeNames.has(typeName))
					canSimplifyWithColor = false;
			});
			if (canSimplifyWithColor) {
				colorSubTypeNames.push('int');
				optimizedTypes = new Set(Array.from(optimizedTypes).filter(t => colorSubTypeNames.indexOf(t.name) === -1));
				optimizedTypes.add(new ColorType());
			}
		}
		optimizedTypes = removeContainedTypes(optimizedTypes);
		optimizeListsInDataTypeSet(optimizedTypes);
		mergeCompositeDataTypes(optimizedTypes);
		this.types = optimizedTypes;
	}

	static parseTokensToDataTypeSet(tokens) {
		if (tokens.length === 1 && tokens[0].val === '*')
			return DataTypes.getAllAssignableDataTypes();
		if (tokens.length === 1 && tokens[0].val === null)
			return new DataTypes();
		return new Set(tokens.map(function(typeToken) {
			if (typeToken.children.length === 0)
				return DataTypes.createFromName(typeToken.val);
			else if (typeToken.val === 'list') {
				const subtypes = DataTypes.parseTokensToDataTypeSet(typeToken.children);
				return new DataListType(subtypes);
			}
			else
				throw new Error(`Unable to use templated types for data type ${typeToken.val}.`);
		}));
	}

	static parse(dataTypeString) {
		if (dataTypeString === null) 
			return new Set();
			// null from .json files represents no types.
			// It is like "void".

		if (dataTypeString === '*')
			return DataTypes.getAllAssignableDataTypes();

		else {
			const dataTypeRootToken = parseDataTypeString(dataTypeString);
			return DataTypes.parseTokensToDataTypeSet(dataTypeRootToken.children);
		}
	}

	toString() {
		return DataTypes.stringify(this.types);
	}

	static sortBySetSize(typesArray) {
		if (!(typesArray instanceof Array))
			throw new Error('Array expected');
		// can't use Array's sort method because the comparison function defines only creates a partial order instead of a full order.
		for (let startI = 0; startI < typesArray.length - 1; startI++) {
			for (let i = startI + 1; i < typesArray.length; i++) {
				const type1 = typesArray[i];
				const type2 = typesArray[startI];
				if (isDataTypeContaining(type1, type2) === true) {
					// swap.
					const temp = typesArray[i];
					typesArray[i] = typesArray[startI];
					typesArray[startI] = temp;
				}
			}
		}
	}

	static stringify(typeSet) {
		if (typeSet instanceof DataTypes)
			typeSet = typeSet.types;
		if (typeSet instanceof Set)
			typeSet = Array.from(typeSet);
		else if (!(typeSet instanceof Array))
			throw new Error(`DataTypes, Set, or Array expected. Not: ${typeSet}`);

		const result = typeSet.map(function(type) {
			return type.toString();
		});
		result.sort();
		return result.join('|');
	}

	static union(typeSet1, typeSet2) {
		if (!(typeSet1 instanceof Set))
			throw new Error(`typeSet1 expected to be a Set but got ${typeSet1}`);
		if (!(typeSet2 instanceof Set))
			throw new Error(`typeSet2 expected to be a Set but got ${typeSet2}`);
		const result = new DataTypes(new Set([...typeSet1, ...typeSet2]));
		return result.types;
	}
};