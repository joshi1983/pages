import { testForFixer } from
'./testForFixer.js';
import { testIsLikelyTerrapin } from
'./testIsLikelyTerrapin.js';
import { testMinusFixer } from
'./testMinusFixer.js';
import { testScan } from
'./testScan.js';
import { testSlashFixer } from './testSlashFixer.js';
import { testTerrapinToWebLogo } from './testTerrapinToWebLogo.js';
import { testTerrapinToWebLogoWithExamples } from
'./testTerrapinToWebLogoWithExamples.js';
import { testThenFixer } from './testThenFixer.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testTerrapin(logger) {
	wrapAndCall([
		testForFixer,
		testIsLikelyTerrapin,
		testMinusFixer,
		testScan,
		testSlashFixer,
		testTerrapinToWebLogo,
		testTerrapinToWebLogoWithExamples,
		testThenFixer
	], logger);
};