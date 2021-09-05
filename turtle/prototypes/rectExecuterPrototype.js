import { analyzeCodeQuality } from '../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { BufferedParseLogger } from '../modules/parsing/loggers/BufferedParseLogger.js';
import { CachedParseTree } from '../modules/parsing/parse-tree-analysis/CachedParseTree.js';
import { compile } from '../modules/parsing/compile.js';
import { getProceduresMap } from '../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../modules/parsing/LogoParser.js';
import { RateLimiter } from '../modules/RateLimiter.js';
import { scrapeProceduresFromParseTreeTokens } from '../modules/parsing/parse-tree-analysis/scrapeProceduresFromParseTreeTokens.js';

const messageContainer = document.getElementById('messages');
function updateMessages(logger) {
	const messages = logger.getMessages();
	messageContainer.innerHTML = '';
	messages.forEach(function(message) {
		const messageDiv = document.createElement('div');
		if (message.isHTML)
			messageDiv.innerHTML = message.msg;
		else
			messageDiv.innerText = message.msg;
		messageContainer.appendChild(messageDiv);
	});
}

const compileRunKey = 'COMPILE_RUN';
const compileOptions = {
	'translateToJavaScript': true
};
function compileAndRun() {
	const code = document.getElementById('code').value;
	const parseLogger = new BufferedParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree !== undefined && !parseLogger.hasLoggedErrors()) {
		const extraProcedures = new Map();
		const procs = scrapeProceduresFromParseTreeTokens(tree);
		const cachedParseTree = new CachedParseTree(tree, extraProcedures, new Map());
		const proceduresMap = getProceduresMap(tree);
		const initialVariablesMap = new Map();
		const isCompleteProgram = true;
		analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap, isCompleteProgram);
		if (!parseLogger.hasLoggedErrors()) {
			const program = compile(code, tree, parseLogger, extraProcedures, compileOptions, initialVariablesMap);
			console.log(`got program ${program}`);
		}
	}
	updateMessages(parseLogger);
}

function rateLimitedCompileAndRun() {
	RateLimiter.run(compileRunKey, compileAndRun, 500);
}

document.addEventListener('change', rateLimitedCompileAndRun);
rateLimitedCompileAndRun();

