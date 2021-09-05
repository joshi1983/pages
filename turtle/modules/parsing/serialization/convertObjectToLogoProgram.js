import { convertObjectToParseTree } from
'./convertObjectToParseTree.js';
import { LogoProgram } from
'../execution/LogoProgram.js';

// FIXME: should createLogoInstructionFromDTO 
// be used to convert instruction objects to exactly the right class?

export function convertObjectToLogoProgram(obj) {
	const result = new LogoProgram(obj.code,
		convertObjectToParseTree(obj.parseTree),
		obj.procedures, obj.instructions);
	
	return result;
};