import { BufferedParseLogger } from './modules/parsing/loggers/BufferedParseLogger.js';
import { compile, asyncInit as compileAsyncInit } from
'./modules/parsing/compile.js';
import { LogoParser } from './modules/parsing/LogoParser.js';

const compileOptions = {
	'forProduction': true,
	'translateToJavaScript': true,
	'mergeJavaScriptInstructions': true,
	'parsedOptimize': true
};

onmessage = function(e) {
	const code = e.data;
	if (typeof code !== 'string')
		console.error('code expected to be a string but got: ' + code);
	LogoParser.asyncInit().then(async function() {
		const logger = new BufferedParseLogger();
		const proceduresMap = new Map();
		const extraProcedures = new Map();
		const initialVariables = new Map();
		const tree = LogoParser.getParseTree(code, logger, proceduresMap);
		await compileAsyncInit();
		const program = compile(code, tree, logger, extraProcedures,
			compileOptions, initialVariables);
		postMessage({
			'program': program,
			'tree': tree,
			'messages': logger._messages
		});
	});
}