import { asmTurtleExamples } from '../../../helpers/parsing/asmTurtleExamples.js';
import { codeToTranslator } from '../../../../modules/components/code-editor/code-fixer/codeToTranslator.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate as translateASMTurtle } from
'../../../../modules/parsing/asm-turtle/translation-to-weblogo/translate.js';

const cases = [];
/*
FIXME: convert various content and data for different translators into cases.
*/
addCases(asmTurtleExamples, forEach();

export function testCodeToTranslator(logger) {
	testInOutPairs(cases, codeToTranslator, logger);
};