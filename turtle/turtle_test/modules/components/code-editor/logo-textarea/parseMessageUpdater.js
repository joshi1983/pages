import { analyzeCodeQuality } from '../../../parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { BufferedParseLogger } from '../../../parsing/loggers/BufferedParseLogger.js';
import { CachedParseTree } from '../../../parsing/parse-tree-analysis/CachedParseTree.js';
import { CodeEditor } from '../../CodeEditor.js';
import { denoiseParseMessages } from '../../../parsing/parse-tree-analysis/denoising/denoiseParseMessages.js';
import { EventQueue } from '../../EventQueue.js';
import { getProceduresMap } from '../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../../parsing/LogoParser.js';
let latestCode = '';
let parseLogger = new BufferedParseLogger();

function refreshMessages() {
	const newCode = CodeEditor.getSourceCode();
	if (newCode !== latestCode && CodeEditor.isVisible) {
		latestCode = newCode;
		parseLogger.reset();
		let cachedParseTree;
		const tree = LogoParser.getParseTree(newCode, parseLogger);
		if (!parseLogger.hasLoggedErrors()) {
			const proceduresMap = getProceduresMap(tree);
			const initialVariablesMap = new Map();
			cachedParseTree = new CachedParseTree(tree, proceduresMap, initialVariablesMap);
			analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap);
		}
		const messages = parseLogger.getMessages();
		denoiseParseMessages(cachedParseTree, messages);
		CodeEditor.setParseMessages(messages);
		CodeEditor.removeAllBreakpoints('code was modified');
		if (parseLogger.hasLoggedErrors())
			EventQueue.addEvent({'type': 'parse-errors'});
		else
			EventQueue.addEvent({'type': 'no-parse-errors'});
	}
}

setInterval(refreshMessages, 200);
