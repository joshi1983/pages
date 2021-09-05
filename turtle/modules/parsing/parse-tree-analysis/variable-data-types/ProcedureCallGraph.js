function toName(proc) {
	if (proc === undefined)
		return 'undefined';
	else if (typeof proc === 'string')
		return proc;
	else
		return proc.name;
}

function addProcedurePair(procMap, proc1, proc2) {
	proc1 = toName(proc1);
	proc2 = toName(proc2);
	if (!procMap.has(proc2))
		procMap.set(proc2, new Set());
	let calls = procMap.get(proc2);
	if (!calls.has(proc1))
		calls.add(proc1);
}

export class ProcedureCallGraph {
	constructor(cachedParseTree) {
		const callsMap = cachedParseTree.getProcedureCallsMap();
		this.fromProcCalls = new Map(); // [fromProc] => [Set of toProc]
		this.toProcCalls = new Map(); // [toProc] => [Set of fromProc]
		for (const [procName, callTokens] of callsMap) {
			for (let i = 0; i < callTokens.length; i++) {
				const callToken = callTokens[i];
				const fromProcedure = cachedParseTree.getProcedureAtToken(callToken);
				const toProc = cachedParseTree.getProcedureByName(procName);
				this._addCall(fromProcedure, toProc);
			}
		}
		// calculate transitive closure.
		let isTransitiveClosureIncomplete = true;
		while (isTransitiveClosureIncomplete) {
			isTransitiveClosureIncomplete = false;
			for (const [fromProcedure, toProcCallSet] of this.fromProcCalls) {
				for (let toProc of toProcCallSet) {
					const procCalledSet2 = this.fromProcCalls.get(toName(toProc));
					if (procCalledSet2 !== undefined) {
						for (let toProc2 of procCalledSet2) {
							if (!this.doesProcedureCallProcedure(fromProcedure, toProc2)) {
								isTransitiveClosureIncomplete = true;
								this._addCall(fromProcedure, toProc2);
							}
						}
					}
				}
			}
		}
	}

	_addCall(fromProc, toProc) {
		addProcedurePair(this.toProcCalls, fromProc, toProc);
		addProcedurePair(this.fromProcCalls, toProc, fromProc);
	}

	// To check if the procedure is called from outside of any procedure, pass undefined for fromProc.
	doesProcedureCallProcedure(fromProc, toProc) {
		//if (toProc !== undefined && !(toProc instanceof Procedure))
		//	throw new Error('toProc must be a Procedure');
		fromProc = toName(fromProc);
		toProc = toName(toProc);
		const calls = this.fromProcCalls.get(fromProc);
		if (calls === undefined)
			return false;
		return calls.has(toProc);
	}

	getProceduresCalling(toProc) {
		toProc = toName(toProc);
		const calls = this.toProcCalls.get(toProc);
		if (calls === undefined)
			return new Set();
		else
			return calls;
	}
};