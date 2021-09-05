import { BufferedParseLogger } from '../../parsing/loggers/BufferedParseLogger.js';
import { CodeEditor } from '../CodeEditor.js';
import { CommandBoxMessages } from '../CommandBoxMessages.js';
import { CommandBoxParseLogger } from '../../parsing/loggers/CommandBoxParseLogger.js';
import { fixCode } from './code-fixer/fixCode.js';
import { isLikelyPythonCode } from '../../parsing/python-parsing/isLikelyPythonCode.js';
import { getProceduresMap } from '../../parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../parsing/LogoParser.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { refreshAnimationSetupFromTree } from './refreshAnimationSetupFromTree.js';
import { asyncInit, translatePythonCodeToWebLogo } from '../../parsing/python-parsing/translatePythonCodeToWebLogo.js';

const menuItem = CodeEditor.editor.querySelector('#editor-fix-code');
const codeFixCache = new Map();
const parseLogger = new BufferedParseLogger();
let isPythonParserLoaded = false;
asyncInit().then(() => isPythonParserLoaded = true);

function getFixedCode() {
	const originalCode = CodeEditor.getSourceCode();
	if (!codeFixCache.has(originalCode)) {
		codeFixCache.clear();
		let intermediateCode = originalCode;
		if (isLikelyPythonCode(intermediateCode) && isPythonParserLoaded)
			intermediateCode = translatePythonCodeToWebLogo(intermediateCode);
		parseLogger.reset();
		const tempParseLogger = new ParseLogger();
		const tree = LogoParser.getParseTree(intermediateCode, tempParseLogger);
		let fixedCode = intermediateCode;
		if (!tempParseLogger.hasLoggedErrors()) {
			const proceduresMap = getProceduresMap(tree);
			fixedCode = fixCode(intermediateCode, parseLogger, proceduresMap);
			refreshAnimationSetupFromTree(tree);
		}
		codeFixCache.set(originalCode, fixedCode);
	}
	return codeFixCache.get(originalCode);
}

function itemClicked() {
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

setInterval(refreshDisabled, 1000);