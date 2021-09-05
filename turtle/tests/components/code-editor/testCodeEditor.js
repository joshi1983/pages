import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testCodeFixer } from './code-fixer/testCodeFixer.js';
import { testFormat } from './format/testFormat.js';
import { testHarmonizeCaseDirectory } from './harmonize-case/testHarmonizeCaseDirectory.js';
import { testLogoTextarea } from './logo-textarea/testLogoTextarea.js';

export function testCodeEditor(logger) {
	testCodeFixer(prefixWrapper('testCodeFixer', logger));
	testFormat(prefixWrapper('testFormat', logger));
	testHarmonizeCaseDirectory(prefixWrapper('testHarmonizeCaseDirectory', logger));
	testLogoTextarea(prefixWrapper('testLogoTextarea', logger));
};