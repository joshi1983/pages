import { testObjectExplorer } from './object-explorer/testObjectExplorer.js';
import { testSerialization } from './serialization/testSerialization.js';
import { testShapeDisplay } from './testShapeDisplay.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testShapeExplorer(logger) {
	wrapAndCall([
		testObjectExplorer,
		testSerialization,
		testShapeDisplay
	], logger);
};