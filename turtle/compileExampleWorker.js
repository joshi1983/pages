import { BufferedParseLogger } from './modules/parsing/loggers/BufferedParseLogger.js';
import { LogoParser } from './modules/parsing/LogoParser.js';

const compileOptions = {
	'forProduction': true,
	'translateToJavaScript': true,
	'mergeJavaScriptInstructions': true,
	'parsedOptimize': true
};
let compile, compileModulePromise;

async function getCompileFunction() {
	if (compileModulePromise === undefined)
		compileModulePromise = import('./modules/parsing/compile.js');

	const m = await compileModulePromise;
	return m.compile;
}

function instructionToDTO(instruction) {
	const result = instruction.toDTO();
	return result;
}

function makeLogoProgramSerializable(program) {
	program.instructions = program.instructions.map(instructionToDTO);
	return program;
}

onmessage = function(e) {
	const code = e.data;
	if (typeof code !== 'string')
		console.error('code expected to be a string but got: ' + code);
	LogoParser.asyncInit().then(async function() {
		const compile = await getCompileFunction();
		const logger = new BufferedParseLogger();
		const proceduresMap = new Map();
		const extraProcedures = new Map();
		const initialVariables = new Map();
		const tree = LogoParser.getParseTree(code, logger, proceduresMap);
		let program;
		if (tree !== undefined) {
			program = compile(code, tree, logger, extraProcedures,
				compileOptions, initialVariables);
		}
		postMessage({
			'program': makeLogoProgramSerializable(program),
			'tree': tree,
			'messages': logger._messages
		});
	});
}