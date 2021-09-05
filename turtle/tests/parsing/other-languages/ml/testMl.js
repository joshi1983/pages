import { testIsLikelyMetaLanguage } from './testIsLikelyMetaLanguage.js';
import { testOcaml } from './ocaml/testOcaml.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testMl(logger) {
	wrapAndCall([
		testIsLikelyMetaLanguage,
		testOcaml,
	], logger);
};