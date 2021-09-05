import { DataTypes } from '../../../data-types/DataTypes.js';
await DataTypes.asyncInit();

const typePredicateMap = new Map([
	['boolean?', 'bool'],
	['color?', 'color'],
	['finite?', 'num(finite)'],
	['integer?', 'int'],
	['list?', 'list'],
	['plist?', 'plist'],
	['number?', 'num'],
	['string?', 'string']
]);
for (const [key, value] of typePredicateMap) {
	typePredicateMap.set(key, new DataTypes(value));
}

export { typePredicateMap };