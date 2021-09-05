import { Command } from
'../../Command.js';
import { ParseTreeToken } from
'../../ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isNoProcedureCalled(cachedParseTree) {
	const root = cachedParseTree.root;
	return !cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		some(t => Command.getCommandInfo(t.val) === undefined && t.parentNode === root);
}

function compareProcedures(proc1, proc2) {
	// 0 parameters is preferred.
	// 0 parameters saves us from risking a bad parameter data type or value.
	if (proc1.parameters.length < proc2.parameters.length)
		return -1;
	if (proc2.parameters.length < proc1.parameters.length)
		return 1;

	// demo is the best procedure name if parameters.length is equal.
	if (proc1.name === 'demo')
		return -1;
	if (proc2.name === 'demo')
		return 1;
	return 0;
}

export function callDemoProcedureFixer(cachedParseTree, fixLogger) {
	if (isNoProcedureCalled(cachedParseTree)) {
		const procedures = cachedParseTree.getProceduresMap();
		const procsArray = Array.from(procedures.values());
		procsArray.sort(compareProcedures);
		let proc = procsArray[0];
		if (proc !== undefined) {
			let lastToken = cachedParseTree.root.getLastToken();
			const callToken = new ParseTreeToken(proc.name, null, lastToken.lineIndex + 1, lastToken.colIndex,
				ParseTreeTokenType.PARAMETERIZED_GROUP);
			cachedParseTree.root.appendChild(callToken);
			cachedParseTree.tokenAdded(callToken);
			lastToken = callToken;
			for (let i = 0; i < proc.parameters.length; i++) {
				const paramToken = new ParseTreeToken(100, null, 
					lastToken.lineIndex, lastToken.colIndex + 5,
					ParseTreeTokenType.NUMBER_LITERAL);
				paramToken.originalString = '100';
				callToken.appendChild(paramToken);
				cachedParseTree.tokenAdded(paramToken);
				lastToken = paramToken;
			}
			fixLogger.log(`Added a call to procedure ${proc.name} so the program will do more.`, callToken);
		}
	}
};