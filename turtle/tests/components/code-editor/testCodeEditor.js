import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testCodeFixer } from './code-fixer/testCodeFixer.js';
import { testFormat } from './format/testFormat.js';
import { testLogoTextArea } from './logo-textarea/testLogoTextArea.js';

export function testCodeEditor(logger) {
	testCodeFixer(prefixWrapper('testCodeFixer', logger));
	testFormat(prefixWrapper('testFormat', logger));
	testLogoTextArea(prefixWrapper('testLogoTextArea', logger));
};