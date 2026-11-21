import { BufferedParseLogger } from './modules/parsing/loggers/BufferedParseLogger.js';
import { LogoParser } from './modules/parsing/LogoParser.js';

const compileOptions = {
	'forProduction': true,
	'translateToJavaScript': true,
	'mergeJavaScriptInstructions': true,
	'parsedOptimize': true
};
let compileModulePromise;
let convertLogoProgramToSerializableObjectPromise;

async function getCompileFunction() {
	if (compileModulePromise === undefined)
		compileModulePromise = import('./modules/parsing/compile.js');

	const m = await compileModulePromise;
	return m.compile;
}

async function getLogoProgramToSerializableObject() {
	if (convertLogoProgramToSerializableObjectPromise === undefined)
		convertLogoProgramToSerializableObjectPromise = import('./modules/parsing/convertLogoProgramToSerializableObject.js');

	const m = await convertLogoProgramToSerializableObjectPromise;
	return m.convertLogoProgramToSerializableObject;
}

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
		let program;
		if (tree !== undefined) {
			const compile = await getCompileFunction();
			program = compile(code, tree, logger, extraProcedures,
				compileOptions, initialVariables);
		}
		let serializedProgram;
		let serializableTree;
		if (program !== undefined) {
			const convertLogoProgramToSerializable = await getLogoProgramToSerializableObject();
			const serializedProgram = convertLogoProgramToSerializable(program);
			serializableTree = serializedProgram.tree;
		}
		else
			serializableTree = ;
		postMessage({
			'program': serializedProgram,
			'tree': serializableTree,
			'messages': logger._messages
		});
	});
}