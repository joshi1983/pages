import { BufferedParseLogger } from '../../parsing/loggers/BufferedParseLogger.js';
import { CodeEditor } from '../CodeEditor.js';
import { CommandBoxMessages } from '../CommandBoxMessages.js';
import { CommandBoxParseLogger } from '../../parsing/loggers/CommandBoxParseLogger.js';
import { EventQueue } from '../EventQueue.js';
import { fixCode } from './code-fixer/fixCode.js';
import { formatCode } from './format/formatCode.js';
import { harmonizeCase } from './harmonize-case/harmonizeCase.js';
import { hasUnsafeErrorMessages } from './code-fixer/hasUnsafeErrorMessages.js';
import { isLikelyASMTurtle } from '../../parsing/asm-turtle/isLikelyASMTurtle.js';
import { isLikelyCodeHeartTurtleScript } from '../code-editor/code-fixer/fixers/codeheart-turtlescript/isLikelyCodeHeartTurtleScript.js';
import { isLikelyKTurtle } from '../../parsing/kturtle/isLikelyKTurtle.js';
import { isLikelyLogo3D } from './code-fixer/fixers/logo-3d/isLikelyLogo3D.js';
import { isLikelyPapert } from './code-fixer/fixers/papert/isLikelyPapert.js';
import { isLikelyPythonCode } from '../../parsing/python-parsing/isLikelyPythonCode.js';
import { isLikelySonicWebTurtle } from '../../parsing/sonic-webturtle/isLikelySonicWebTurtle.js';
import { getProceduresMap } from '../../parsing/parse-tree-analysis/getProceduresMap.js';
import { logo3DToWebLogo } from './code-fixer/fixers/logo-3d/logo3DToWebLogo.js';
import { LogoParser } from '../../parsing/LogoParser.js';
import { papertToWebLogo } from './code-fixer/fixers/papert/papertToWebLogo.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { refreshAnimationSetupFromTree } from './refreshAnimationSetupFromTree.js';
import { translate as translateASMTurtle } from '../../parsing/asm-turtle/translation-to-weblogo/translate.js';
import { translate as translateKTurtle } from '../../parsing/kturtle/translation-to-weblogo/translate.js';
import { translate as translateSonicWebTurtle } from '../../parsing/sonic-webturtle/translation-to-weblogo/translate.js';
import { translateToWebLogo as translateCodeHeartTurtleScriptToWebLogo } from
'../../components/code-editor/code-fixer/fixers/codeheart-turtlescript/translateToWebLogo.js';
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
		let adjustAesthetics = false;
		parseLogger.reset();
		if (isLikelyPythonCode(intermediateCode) && isPythonParserLoaded)
			intermediateCode = translatePythonCodeToWebLogo(intermediateCode);
		else if (isLikelyLogo3D(intermediateCode)) {
			intermediateCode = logo3DToWebLogo(intermediateCode, parseLogger);
			adjustAesthetics = true;
		}
		else if (isLikelyPapert(intermediateCode)) {
			intermediateCode = papertToWebLogo(intermediateCode, parseLogger);
			adjustAesthetics = true;
		}
		else if (isLikelyKTurtle(intermediateCode)) {
			intermediateCode  = translateKTurtle(intermediateCode);
		}
		else if (isLikelyCodeHeartTurtleScript(intermediateCode)) {
			intermediateCode = translateCodeHeartTurtleScriptToWebLogo(intermediateCode);
		}
		else if (isLikelyASMTurtle(intermediateCode)) {
			intermediateCode = translateASMTurtle(intermediateCode);
		}
		else if (isLikelySonicWebTurtle(intermediateCode)) {
			intermediateCode = translateSonicWebTurtle(intermediateCode);
		}
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