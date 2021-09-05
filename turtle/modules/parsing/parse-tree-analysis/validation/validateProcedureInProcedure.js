export function validateProcedureInProcedure(cachedParseTree, parseLogger) {
	const toCalls = cachedParseTree.getCommandCallsByName('to');
	toCalls.forEach(function(toCall) {
		let extra = '';
		let nestedProcName;
		if (toCall.children.length > 0 && typeof toCall.children[0].val === 'string')
			nestedProcName = toCall.children[0].val;
		if (nestedProcName !== undefined) {
			const parentProc = cachedParseTree.getProcedureAtToken(toCall);
			if (parentProc === undefined)
				return;
			else
				extra = `A procedure named ${nestedProcName} is being nested in procedure ${parentProc.name}.`;
		}
		parseLogger.error(`You can not define a procedure in another procedure. ${extra} Did you forget to use "end" to mark the end of the previous procedure?`, toCall);
	});
};