import { testAngleDisplay } from './testAngleDisplay.js';
import { testColourToElement } from './testColourToElement.js';
import { testIsAnglePath } from './testIsAnglePath.js';
import { testNamedValue } from './testNamedValue.js';
import { testObjectDisplay } from './testObjectDisplay.js';
import { testSimpleDisplay } from './testSimpleDisplay.js';
import { testToggleNameElement } from './testToggleNameElement.js';
import { testValueToDisplay } from './testValueToDisplay.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testObjectExplorer(logger) {
	wrapAndCall([
		testAngleDisplay,
		testColourToElement,
		testIsAnglePath,
		testNamedValue,
		testObjectDisplay,
		testSimpleDisplay,
		testToggleNameElement,
		testValueToDisplay
	], logger);
};