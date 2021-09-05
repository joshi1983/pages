import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testBoolType } from './testBoolType.js';
import { testColorType } from './testColorType.js';
import { testCProcType } from './testCProcType.js';
import { testDataListType } from './testDataListType.js';
import { testDataTypes } from './testDataTypes.js';
import { testDataTypesContains } from './testDataTypesContains.js';
import { testDataTypesInJSON } from './testDataTypesInJSON.js';
import { testDataTypesIntersectWith } from './testDataTypesIntersectWith.js';
import { testDataTypesOptimize } from './testDataTypesOptimize.js';
import { testDataTypesUnion } from './testDataTypesUnion.js';
import { testGradientType } from './testGradientType.js';
import { testIntegerType } from './testIntegerType.js';
import { testNullType } from './testNullType.js';
import { testNumberType } from './testNumberType.js';

export function testDataTypesDirectory(logger) {
	testBoolType(prefixWrapper('testBoolType', logger));
	testColorType(prefixWrapper('testColorType', logger));
	testCProcType(prefixWrapper('testCProcType', logger));
	testDataListType(prefixWrapper('testDataListType', logger));
	testDataTypes(prefixWrapper('testDataTypes', logger));
	testDataTypesContains(prefixWrapper('testDataTypesContains', logger));
	testDataTypesInJSON(prefixWrapper('testDataTypesInJSON', logger));
	testDataTypesIntersectWith(prefixWrapper('testDataTypesIntersectWith', logger));
	testDataTypesOptimize(prefixWrapper('testDataTypesOptimize', logger));
	testDataTypesUnion(prefixWrapper('testDataTypesUnion', logger));
	testGradientType(prefixWrapper('testGradientType', logger));
	testIntegerType(prefixWrapper('testIntegerType', logger));
	testNullType(prefixWrapper('testNullType', logger));
	testNumberType(prefixWrapper('testNumberType', logger));

	DataTypes.createFromName('string');
	DataTypes.createFromName('list');
	DataTypes.createFromName('color');
	const types = DataTypes.parse('bool|list');
	if (!(types instanceof Set))
		logger('Expected to get a Set from DataTypes.parse');
}