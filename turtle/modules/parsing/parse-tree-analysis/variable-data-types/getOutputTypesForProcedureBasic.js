import { CommandCalls } from '../CommandCalls.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { isLastInstructionAnOutput } from './isLastInstructionAnOutput.js';
import { NullType } from '../../data-types/NullType.js';

export function getOutputTypesForProcedureBasic(procedure, tokenToTypes) {
	// get all output and stop calls within the procedure.
	const outputCalls = CommandCalls.filterCommandCalls(procedure.getStartToken().getAllDescendentsAsArray(), 'output');
	if (outputCalls.length === 0)
		return new DataTypes([new NullType()]);
	const stopCalls = CommandCalls.filterCommandCalls(procedure.getStartToken().getAllDescendentsAsArray(), 'stop');
	const result = new DataTypes();
	if (stopCalls.length !== 0 || !isLastInstructionAnOutput(procedure))
		result.addTypes([new NullType()]);
	outputCalls.forEach(function(outputCall) {
		if (outputCall.children.length === 1) {
			let types = tokenToTypes.get(outputCall.children[0]);
			if (types === undefined)
				types = new DataTypes(DataTypes.getAssignableTypesArray());
			result.addTypes(types);
		}
	});
	return result;
};