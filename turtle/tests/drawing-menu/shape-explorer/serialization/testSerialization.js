import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testDtoToJSON } from './testDtoToJSON.js';
import { testGetCleanShapeName } from './testGetCleanShapeName.js';
import { testShapeToDetailsDTO } from './testShapeToDetailsDTO.js';
import { testShapeToDTO } from './testShapeToDTO.js';
import { testShapeStyleToDTO } from './testShapeStyleToDTO.js';

export function testSerialization(logger) {
	testDtoToJSON(prefixWrapper('testDtoToJSON', logger));
	testGetCleanShapeName(prefixWrapper('testGetCleanShapeName', logger));
	testShapeToDetailsDTO(prefixWrapper('testShapeToDetailsDTO', logger));
	testShapeToDTO(prefixWrapper('testShapeToDTO', logger));
	testShapeStyleToDTO(prefixWrapper('testShapeStyleToDTO', logger));
};