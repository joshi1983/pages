import { testDtoToJSON } from './testDtoToJSON.js';
import { testGetCleanShapeName } from './testGetCleanShapeName.js';
import { testShapeToDetailsDTO } from './testShapeToDetailsDTO.js';
import { testShapeToDTO } from './testShapeToDTO.js';
import { testShapeStyleToDTO } from './testShapeStyleToDTO.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testSerialization(logger) {
	wrapAndCall([
		testDtoToJSON,
		testGetCleanShapeName,
		testShapeToDetailsDTO,
		testShapeToDTO,
		testShapeStyleToDTO
	], logger);
};