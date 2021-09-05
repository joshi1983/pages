import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testAreAllColourStopsOpaque } from './testAreAllColourStopsOpaque.js';
import { testIsPathHidingArc } from './testIsPathHidingArc.js';
import { testIsPathHidingLine } from './testIsPathHidingLine.js';
import { testIsPathHidingPath } from './testIsPathHidingPath.js';
import { testIsPenOpaque } from './testIsPenOpaque.js';

export function testHiding(logger) {
	testAreAllColourStopsOpaque(prefixWrapper('testAreAllColourStopsOpaque', logger));
	testIsPathHidingArc(prefixWrapper('testIsPathHidingArc', logger));
	testIsPathHidingLine(prefixWrapper('testIsPathHidingLine', logger));
	testIsPathHidingPath(prefixWrapper('testIsPathHidingPath', logger));
	testIsPenOpaque(prefixWrapper('testIsPenOpaque', logger));
};