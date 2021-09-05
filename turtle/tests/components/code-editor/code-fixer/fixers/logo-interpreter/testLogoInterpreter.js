import { testFullCircleArcFixer } from './testFullCircleArcFixer.js';
import { testIsLikelyLogoInterpreter } from './testIsLikelyLogoInterpreter.js';
import { testLogoInterpreterToWebLogo } from './testLogoInterpreterToWebLogo.js';
import { testPlusNumberLiteralFixer } from './testPlusNumberLiteralFixer.js';
import { testSetPosBeforeBeginPathFixer } from './testSetPosBeforeBeginPathFixer.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testLogoInterpreter(logger) {
	wrapAndCall([
		testFullCircleArcFixer,
		testIsLikelyLogoInterpreter,
		testLogoInterpreterToWebLogo,
		testPlusNumberLiteralFixer,
		testSetPosBeforeBeginPathFixer
	], logger);
};