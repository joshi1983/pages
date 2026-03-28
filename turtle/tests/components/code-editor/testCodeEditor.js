import { testCodeFixer } from './code-fixer/testCodeFixer.js';
/*import { testFormat } from './format/testFormat.js';
import { testGetSourceCodeWithTokenValueReplacement } from './testGetSourceCodeWithTokenValueReplacement.js';
import { testHarmonizeCaseDirectory } from './harmonize-case/testHarmonizeCaseDirectory.js';
import { testLogoTextarea } from './logo-textarea/testLogoTextarea.js';
import { testMightExecuteDifferently } from './testMightExecuteDifferently.js';
import { testQualityReport } from './quality-report/testQualityReport.js';
import { testShortcuts } from './shortcuts/testShortcuts.js';
import { testShouldNotShowAutofixPromptForCode } from './testShouldNotShowAutofixPromptForCode.js';
*/import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testCodeEditor(logger) {
	wrapAndCall([
		testCodeFixer,
		/*testFormat,
		testGetSourceCodeWithTokenValueReplacement,
		testHarmonizeCaseDirectory,
		testLogoTextarea,
		testMightExecuteDifferently,
		testQualityReport,
		testShortcuts,
		testShouldNotShowAutofixPromptForCode*/
	], logger);
};