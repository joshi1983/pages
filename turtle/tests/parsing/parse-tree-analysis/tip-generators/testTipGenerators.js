import { testGetAnimationTips } from './testGetAnimationTips.js';
import { testGetTipsForJumping } from './testGetTipsForJumping.js';
import { testGetTipsForProcOrCommandName } from './testGetTipsForProcOrCommandName.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTipGenerators(logger) {
	wrapAndCall([
		testGetAnimationTips,
		testGetTipsForJumping,
		testGetTipsForProcOrCommandName
	], logger);
};