import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testAngleDisplay } from './testAngleDisplay.js';
import { testColourToElement } from './testColourToElement.js';
import { testIsAnglePath } from './testIsAnglePath.js';
import { testNamedValue } from './testNamedValue.js';
import { testObjectDisplay } from './testObjectDisplay.js';
import { testSimpleDisplay } from './testSimpleDisplay.js';
import { testToggleNameElement } from './testToggleNameElement.js';
import { testValueToDisplay } from './testValueToDisplay.js';

export function testObjectExplorer(logger) {
	testAngleDisplay(prefixWrapper('testAngleDisplay', logger));
	testColourToElement(prefixWrapper('testColourToElement', logger));
	testIsAnglePath(prefixWrapper('testIsAnglePath', logger));
	testNamedValue(prefixWrapper('testNamedValue', logger));
	testObjectDisplay(prefixWrapper('testObjectDisplay', logger));
	testSimpleDisplay(prefixWrapper('testSimpleDisplay', logger));
	testToggleNameElement(prefixWrapper('testToggleNameElement', logger));
	testValueToDisplay(prefixWrapper('testValueToDisplay', logger));
};