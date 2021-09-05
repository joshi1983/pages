import { ParseTreeToken } from '../ParseTreeToken.js';

export class LogoProgram {
	constructor(code, parseTree, proceduresMap, instructions) {
		if (code !== undefined && typeof code !== 'string')
			throw new Error('code must either be undefined or a string.  Not: ' + code);
		if (!(parseTree instanceof ParseTreeToken))
			throw new Error('parseTree must be a ParseTreeToken.  Not: ' + parseTree);
		if (!(proceduresMap instanceof Map))
			throw new Error('proceduresMap must be a Map');
		if (!(instructions instanceof Array))
			throw new Error('instructions must be an Array');

		this.code = code;
		this.parseTree = parseTree;
		this.instructions = instructions;
		this.procedures = proceduresMap;
	}

	getAllInstructionsWithProcedureNames() {
		const result = [];
		for (let i = 0; i < this.instructions.length; i++) {
			result.push([undefined, i, this.instructions[i]]);
		}
		for (let procedure of this.procedures.values()) {
			for (let i = 0; i < procedure.instructions.length; i++) {
				result.push([procedure.name, i, procedure.instructions[i]]);
			}
		}
		return result;
	}

	getProcedureAtLine(lineIndex) {
		const fakeToken = {'colIndex': 0, 'lineIndex': lineIndex};
		for (let proc of this.procedures.values()) {
			if (proc.isContainingToken(fakeToken))
				return proc;
		}
	}
};