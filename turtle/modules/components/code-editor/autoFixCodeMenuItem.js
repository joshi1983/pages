import { BufferedParseLogger } from '../../parsing/loggers/BufferedParseLogger.js';
import { Code } from './Code.js';
import { CodeEditor } from '../CodeEditor.js';
import { CommandBoxMessages } from '../CommandBoxMessages.js';
import { CommandBoxParseLogger } from '../../parsing/loggers/CommandBoxParseLogger.js';
import { convertObjectToParseTree } from '../../parsing/serialization/convertObjectToParseTree.js';
import { fixCode } from './code-fixer/fixCode.js';
import { getProceduresMap } from '../../parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../parsing/LogoParser.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { refreshAnimationSetupFromTree } from './refreshAnimationSetupFromTree.js';

const menuItem = CodeEditor.editor.querySelector('#editor-fix-code');
const codeFixCache = new Map();
const parseLogger = new BufferedParseLogger();

async function getFixedCode() {
	const originalCode = CodeEditor.getSourceCode();
	await Code.refreshTree();
	if (!codeFixCache.has(originalCode) && Code.tree_ !== undefined &&
	Code.isTreeUpToDateAndParsedWithoutError()) {
		codeFixCache.clear();
		parseLogger.reset();
		const tree = convertObjectToParseTree(Code.tree_); // create deep clone.
		let fixedCode = originalCode;
		const proceduresMap = getProceduresMap(tree);
		fixedCode = fixCode(originalCode, parseLogger, proceduresMap, tree);
		refreshAnimationSetupFromTree(tree);
		codeFixCache.set(originalCode, fixedCode);
	}
	else
		codeFixCache.set(originalCode, originalCode);
	return codeFixCache.get(originalCode);
}

async function itemClicked() {
	CommandBoxMessages.clearErrorsTipsAndWarnings(); // don't confuse the user with old error messages.
	const code = await getFixedCode();
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
	getFixedCode().then(function(fixedCode) {
		if (fixedCode === CodeEditor.getSourceCode()) {
			title += ' (No applicable fixes available)';
			menuItem.setAttribute('disabled', '');
		}
		else
			menuItem.removeAttribute('disabled');
		menuItem.setAttribute('title', title);
	}).catch(function(e) {
		if (e !== 'cancel') {
			console.error('error thrown in autoFixCodeMenuItem refreshDisabled. e=', e);
		}
	});
}

menuItem.addEventListener('click', itemClicked);

setInterval(refreshDisabled, 1000);