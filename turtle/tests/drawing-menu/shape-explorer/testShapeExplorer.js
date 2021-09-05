import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testObjectExplorer } from './object-explorer/testObjectExplorer.js';
import { testSerialization } from './serialization/testSerialization.js';
import { testShapeDisplay } from './testShapeDisplay.js';

export function testShapeExplorer(logger) {
	testObjectExplorer(prefixWrapper('testObjectExplorer', logger));
	testSerialization(prefixWrapper('testSerialization', logger));
	testShapeDisplay(prefixWrapper('testShapeDisplay', logger));
};