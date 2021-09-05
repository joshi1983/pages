import { Colour } from '../modules/Colour.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
import { Transparent } from '../modules/Transparent.js';

function testEquals(logger) {
	if (Transparent.equals("transparent"))
		logger('Transparent should not equal the string \'transparent\' through the equals method');
	if (Transparent === "transparent")
		logger('Transparent should not equal the string \'transparent\' through the === operator');
	if (Transparent !== Transparent)
		logger('Transparent should equal itself through the !== operator');
	if (!Transparent.equals(Transparent))
		logger('Transparent should equal itself through the equals method');
	const c = new Colour('#f00');
	if (Transparent.equals(c))
		logger(`Transparent should not be equal to the colour ${c}.`);
}

export function testTransparent(logger) {
	testEquals(prefixWrapper('testEquals', logger));
};