import { testAddSubtypes } from './testAddSubtypes.js';
import { testAlphaColorListType } from './testAlphaColorListType.js';
import { testAlphaColorType } from './testAlphaColorType.js';
import { testBoolType } from './testBoolType.js';
import { testColorListType } from './testColorListType.js';
import { testColorType } from './testColorType.js';
import { testCProcType } from './testCProcType.js';
import { testDataListType } from './testDataListType.js';
import { testDataTypeParsing } from './data-type-parsing/testDataTypeParsing.js';
import { testDataTypes } from './testDataTypes.js';
import { testDataTypesConstructor } from './testDataTypesConstructor.js';
import { testDataTypesContains } from './testDataTypesContains.js';
import { testDataTypesInJSON } from './testDataTypesInJSON.js';
import { testDataTypesIntersectWith } from './testDataTypesIntersectWith.js';
import { testDataTypesIntersectWithValueCompatability } from './testDataTypesIntersectWithValueCompatability.js';
import { testDataTypesMayBeCompatibleWithValue } from './testDataTypesMayBeCompatibleWithValue.js';
import { testDataTypesOptimize } from './testDataTypesOptimize.js';
import { testDataTypesSortBySetSize } from './testDataTypesSortBySetSize.js';
import { testDataTypesUnion } from './testDataTypesUnion.js';
import { testEasingType } from './testEasingType.js';
import { testExplodeCompositeDataTypes } from './testExplodeCompositeDataTypes.js';
import { testGradientType } from './testGradientType.js';
import { testIntegerType } from './testIntegerType.js';
import { testIsDataTypeContaining } from './testIsDataTypeContaining.js';
import { testMergeCompositeDataTypes } from './testMergeCompositeDataTypes.js';
import { testNullType } from './testNullType.js';
import { testNumberType } from './testNumberType.js';
import { testOptimizeListsInDataTypeSet } from './testOptimizeListsInDataTypeSet.js';
import { testRemoveContainedTypes } from './testRemoveContainedTypes.js';
import { testRemoveNull } from './testRemoveNull.js';
import { testTransparentType } from './testTransparentType.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

const tests = [
	testAddSubtypes,
	testAlphaColorListType,
	testAlphaColorType,
	testBoolType,
	testColorListType,
	testColorType,
	testCProcType,
	testDataListType,
	testDataTypeParsing,
	testDataTypes,
	testDataTypesConstructor,
	testDataTypesContains,
	testDataTypesInJSON,
	testDataTypesIntersectWith,
	testDataTypesIntersectWithValueCompatability,
	testDataTypesMayBeCompatibleWithValue,
	testDataTypesOptimize,
	testDataTypesSortBySetSize,
	testDataTypesUnion,
	testEasingType,
	testExplodeCompositeDataTypes,
	testGradientType,
	testIntegerType,
	testIsDataTypeContaining,
	testMergeCompositeDataTypes,
	testNullType,
	testNumberType,
	testOptimizeListsInDataTypeSet,
	testRemoveContainedTypes,
	testRemoveNull,
	testTransparentType
];

export function testDataTypesDirectory(logger) {
	wrapAndCall(tests, logger);
};