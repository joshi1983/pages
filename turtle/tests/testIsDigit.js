import { isDigit } from '../modules/isDigit.js';
import { testInOutPairs } from './helpers/testInOutPairs.js';

export function testIsDigit(logger) {
	const cases = [];
	'0123456789'.split('').forEach((digit) => cases.push({'in': digit, 'out': true}));
	'_~!@#$%^&*()+-={}[];/?asdfghjklASDFGHJKL'.split('').forEach((nonDigit) => cases.push({'in': nonDigit, 'out': false}));
	testInOutPairs(cases, isDigit, logger);
};