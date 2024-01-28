import { analyzeCodeQuality } from '../../parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { CommandBoxMessages } from '../CommandBoxMessages.js';
import { CommandBoxParseLogger } from '../../parsing/loggers/CommandBoxParseLogger.js';
import { compile } from '../../parsing/compile.js';
import { EditorLocalStorage } from './EditorLocalStorage.js';
import { getProceduresMap } from '../../parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../parsing/LogoParser.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { scrapeProcedures } from '../../parsing/parse-tree-analysis/scrapeProcedures.js';
import { ToastMessages } from '../ToastMessages.js';

class PrivateCode {
	constructor() {
		this.sourceCode = '';
		this.loadFromLocalStorage();
		this._latestProgramIsUpToDate = false; 
		// represents if this.latestProgram corresponds with the current code.
		// this.latestProgram might lag behind recent changes to code if the 
		// user introduced parsing or compiling errors.

		this._currentProgram = undefined;
		// represents the program reflected by the current code.
	}

	getCurrentProgram() {
		// no need to recompile if latestProgram is up to date.
		if (this._latestProgramIsUpToDate)
			return this.latestProgram;
		if (this._currentProgram !== undefined)
			return this._currentProgram;

		const hiddenLogger = new ParseLogger();
		const tree = LogoParser.getParseTree(this.sourceCode, hiddenLogger);
		if (hiddenLogger.hasLoggedErrors())
			return undefined;
		const proceduresMap = getProceduresMap(tree);
		const initialVariablesMap = this.executer === undefined ? new Map() : this.executer.getGlobalVariables();
		analyzeCodeQuality(tree, hiddenLogger, proceduresMap, initialVariablesMap);
		if (hiddenLogger.hasLoggedErrors())
			return undefined;
		const compileOptions = {
			'translateToJavaScript': true
		};
		this._currentProgram = compile(this.sourceCode, tree, hiddenLogger, new Map(), compileOptions, initialVariablesMap);
		return this._currentProgram;
	}

	getFileName() {
		return this.filename;
	}

	getProcedures() {
		return scrapeProcedures(this.sourceCode, CommandBoxParseLogger);
	}

	getSourceCode() {
		return this.sourceCode;
	}

	loadFromLocalStorage() {
		this.sourceCode = EditorLocalStorage.getCode();
		this.filename = EditorLocalStorage.getFileName();
	}

	refreshProgram(parseLogger) {
		if (typeof this.sourceCode !== 'string')
			throw new Error(`Expected sourceCode to be a string but found ${this.sourceCode}`);
		parseLogger.resetErrorCounter();
		const tree = LogoParser.getParseTree(this.sourceCode, parseLogger);
		if (!parseLogger.hasLoggedErrors()) {
			const proceduresMap = getProceduresMap(tree);
			const initialVariablesMap = this.executer === undefined ? new Map() : this.executer.getGlobalVariables();
			analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap);
			if (!parseLogger.hasLoggedErrors()) {
				this.tree = tree; // used by the time setter.
				const compileOptions = {'translateToJavaScript': true, 'parsedOptimize': true};
				const program = compile(this.sourceCode, tree, parseLogger, new Map(), 
				compileOptions, initialVariablesMap);
				if (program.instructions.length === 0) {
					if (program.procedures.size !== 0) {
						this.latestProgram = program;
						parseLogger.warn('At least one procedure was defined but it is not called so there is nothing to run.  You can call the procedure(s) from Commander, though.', this.tree);
					}
					else
						parseLogger.warn('There are no instructions to run.', this.tree);
					return false;
				}
				else {
					this.latestProgram = program;
					this._currentProgram = program;
					this._latestProgramIsUpToDate = true;
					if (this.executer !== undefined)
						this.executer.setProgram(program);
					return true;
				}
			}
		}
		return false;
	}

	run() {
		if (this.refreshProgram(CommandBoxParseLogger)) {
			if (this.executer.isPaused()) {
				ToastMessages.warn('Unpaused to run code', false);
			}
			if (!this.executer.isRunning())
				this.executer.startContinuousExecution();
		}
	}

	saveToLocalStorage() {
		EditorLocalStorage.saveCode(this.sourceCode);
		EditorLocalStorage.setFileName(this.filename);
	}

	setExecuter(executer) {
		if (typeof executer !== 'object')
			throw new Error('executer must be an object');

		this.executer = executer;
	}

	setFileName(filename) {
		if (typeof filename !== 'string')
			throw new Error('filename must be a string');
		this.filename = filename;
		this.saveToLocalStorage();
	}

	setSourceCode(sourceCode) {
		if (typeof sourceCode !== 'string')
			throw new Error(`setSourceCode requires a string.  Not: ${sourceCode}`);
		if (this.sourceCode !== sourceCode) {
			this.sourceCode = sourceCode;
			this._currentProgram = undefined;
			this._latestProgramIsUpToDate = false;
			this.saveToLocalStorage();
		}
	}
};

const Code = new PrivateCode();

export { Code };