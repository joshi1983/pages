import { compile } from '../compile.js';
import { fetchJson } from '../../fetchJson.js';
import { fetchText } from '../../fetchText.js';
import { LogoParser } from '../LogoParser.js';
import { Module } from '../parse-tree-token/Module.js';
import { ParseLogger } from '../loggers/ParseLogger.js';
import { StringBuffer } from '../../StringBuffer.js';
import { StringUtils } from '../../StringUtils.js';

let library;

await LogoParser.asyncInit();

const pathPrefix = 'logo-scripts/internal/command-procs/';
const procsData = await fetchJson(pathPrefix + 'index.json');
const contentBuffer = new StringBuffer();
const procsMap = new Map();
for (const proc of procsData) {
	const path = pathPrefix + proc;
	const procCode = await fetchText(path);
	const name = StringUtils.removeFileExtension(proc.toLowerCase());
	procsMap.set(name, procCode);
	contentBuffer.append(procCode);
	contentBuffer.append('\n');
}
const code = contentBuffer.toString().trim();

function getLibrary() {
	if (library === undefined) {
		const parseLogger = new ParseLogger();
		const extraProcedures = new Map();
		const proceduresMap = undefined;
		const options = {};
		const tree = LogoParser.getParseTree(code, parseLogger, proceduresMap, options);
		new Module('internal').assignToParseTree(tree);
		const compileOptions = {
			'forProduction': true,
			'mergeJavaScriptInstructions': true,
			'parsedOptimize': true,
			'translateToJavaScript': true
		};
		const initialVariables = new Map();
		library = compile(code, tree, parseLogger, extraProcedures,
			compileOptions, initialVariables);
	}
	return library;
}

class PrivateInternalProcedures {

	getAllCode() {
		return code;
	}

	getCodeForProcedure(name) {
		name = name.toLowerCase();
		return procsMap.get(name);
	}

	getCompiledLibrary() {
		return getLibrary();
	}
}

const InternalProcedures = new PrivateInternalProcedures();

export { InternalProcedures };