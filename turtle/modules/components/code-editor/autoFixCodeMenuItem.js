import { BufferedParseLogger } from '../../parsing/loggers/BufferedParseLogger.js';
import { CodeEditor } from '../CodeEditor.js';
import { codeToTranslator } from './code-fixer/codeToTranslator.js';
import { CommandBoxMessages } from '../CommandBoxMessages.js';
import { CommandBoxParseLogger } from '../../parsing/loggers/CommandBoxParseLogger.js';
import { EventQueue } from '../EventQueue.js';
import { fixCode } from './code-fixer/fixCode.js';
import { formatCode } from './format/formatCode.js';
import { harmonizeCase } from './harmonize-case/harmonizeCase.js';
import { hasUnsafeErrorMessages } from './code-fixer/hasUnsafeErrorMessages.js';
import { getProceduresMap } from '../../parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../parsing/LogoParser.js';
import { refreshAnimationSetupFromTree } from './refreshAnimationSetupFromTree.js';

const menuItem = CodeEditor.editor.querySelector('#editor-fix-code');
const codeFixCache = new Map();
const parseLogger = new BufferedParseLogger();

function getFixedCode() {
	const originalCode = CodeEditor.getSourceCode();
	if (!codeFixCache.has(originalCode)) {
		codeFixCache.clear();
		let intermediateCode = originalCode;
		parseLogger.reset();
		const [translator, adjustAesthetics] = codeToTranslator(intermediateCode);
		intermediateCode = translator(intermediateCode, parseLogger);
		const tempParseLogger = new BufferedParseLogger();
		const tree = LogoParser.getParseTree(intermediateCode, tempParseLogger);
		let fixedCode = intermediateCode;
		if (!hasUnsafeErrorMessages(tempParseLogger)) {
			const proceduresMap = getProceduresMap(tree);
			fixedCode = fixCode(intermediateCode, parseLogger, proceduresMap);
			refreshAnimationSetupFromTree(tree);
		}
		if (adjustAesthetics) {
			fixedCode = harmonizeCase(fixedCode);
			fixedCode = formatCode(fixedCode);
			if (tree !== undefined) {
				parseLogger.tip('Performed a couple extra improvements to readability.  '+
				'Harmonized case and command name alternatives.  Also formatted whitespaces.', tree, false);
			}
		}
		codeFixCache.set(originalCode, fixedCode);
		if (originalCode !== fixedCode)
			EventQueue.addEvent({
				'type': 'autofix',
				'fixedCode': fixedCode
			});
		else
			EventQueue.addEvent({
				'type': 'no-autofix'
			});
	}
	return codeFixCache.get(originalCode);
}

export function itemClicked() {
	CommandBoxMessages.clearErrorsTipsAndWarnings(); // don't confuse the user with old error messages.
	const code = getFixedCode();
	CodeEditor.setSourceCode(code);
	parseLogger.sendAllMessagesTo(CommandBoxParseLogger);
	CodeEditor.restore();
	// make sure the editor is not maximized so the tips for what was changed are visible.
}

function refreshDisabled() {
	// No need to refresh if the editor isn't visible.
	// The menu won't show until the editor is visible.
	if (CodeEditor.isVisible === false)
		return;
	let title = 'Automatically fix coding mistakes';
	if (getFixedCode() === CodeEditor.getSourceCode()) {
		title += ' (No applicable fixes available)';
		menuItem.setAttribute('disabled', '');
	}
	else
		menuItem.removeAttribute('disabled');
	menuItem.setAttribute('title', title);
}

menuItem.addEventListener('click', itemClicked);

setInterval(refreshDisabled, 2000);