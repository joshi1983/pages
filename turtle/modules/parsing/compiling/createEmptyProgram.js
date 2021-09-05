import { compile } from '../compile.js';
import { LogoParser } from '../LogoParser.js';
import { ParseLogger } from '../loggers/ParseLogger.js';

const code = '';
const logger = new ParseLogger();
const compileOptions = {};

export function createEmptyProgram() {
	const tree = LogoParser.getParseTree(code, logger);
	const extraProcedures = new Map();
	const initialVariables = new Map();
	return compile(code, tree, logger, extraProcedures, compileOptions, initialVariables);
};