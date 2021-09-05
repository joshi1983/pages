import { testConvertForeachSymbolFixer } from
'./testConvertForeachSymbolFixer.js';
import { testForFixer } from
'./testForFixer.js';
import { testGetAllReferencedProcedures } from
'./testGetAllReferencedProcedures.js';
import { testGoFixer } from
'./testGoFixer.js';
import { testIfInstructionListFixer } from './testIfInstructionListFixer.js';
import { testIsLikelyTerrapin } from
'./testIsLikelyTerrapin.js';
import { testMinusFixer } from
'./testMinusFixer.js';
import { testScan } from
'./testScan.js';
import { testSetFontFixer } from './testSetFontFixer.js';
import { testSlashFixer } from './testSlashFixer.js';
import { testTerrapinToWebLogo } from './testTerrapinToWebLogo.js';
import { testTerrapinToWebLogoWithExamples } from
'./testTerrapinToWebLogoWithExamples.js';
import { testThenFixer } from './testThenFixer.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testTerrapin(logger) {
	wrapAndCall([
		testConvertForeachSymbolFixer,
		testForFixer,
		testGetAllReferencedProcedures,
		testGoFixer,
		testIfInstructionListFixer,
		testIsLikelyTerrapin,
		testMinusFixer,
		testScan,
		testSetFontFixer,
		testSlashFixer,
		testTerrapinToWebLogo,
		testTerrapinToWebLogoWithExamples,
		testThenFixer
	], logger);
};