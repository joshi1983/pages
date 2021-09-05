import { DataTypes } from '../../../data-types/DataTypes.js';
await DataTypes.asyncInit();

const typePredicateMap = new Map([
	['booleanp', 'bool'],
	['colorp', 'color'],
	['integerp', 'int'],
	['listp', 'list'],
	['numberp', 'num'],
	['stringp', 'string']
]);
for (const [key, value] of typePredicateMap) {
	typePredicateMap.set(key, new DataTypes(value));
}

export { typePredicateMap };