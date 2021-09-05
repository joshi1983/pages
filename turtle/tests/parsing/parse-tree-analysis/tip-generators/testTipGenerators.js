import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testGetAnimationTips } from './testGetAnimationTips.js';
import { testGetTipsForProcOrCommandName } from './testGetTipsForProcOrCommandName.js';

export function testTipGenerators(logger) {
	testGetAnimationTips(prefixWrapper('testGetAnimationTips', logger));
	testGetTipsForProcOrCommandName(prefixWrapper('testGetTipsForProcOrCommandName', logger));
};