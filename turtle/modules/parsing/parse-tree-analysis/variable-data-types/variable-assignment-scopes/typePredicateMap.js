import { DataTypes } from '../../../data-types/DataTypes.js';
await DataTypes.asyncInit();

const typePredicateMap = new Map([
	['booleanp', 'bool'],
	['integerp', 'int'],
	['numberp', 'num'],
	['listp', 'list'],
	['stringp', 'string']
]);
for (const [key, value] of typePredicateMap) {
	typePredicateMap.set(key, new DataTypes(value));
}

export { typePredicateMap };