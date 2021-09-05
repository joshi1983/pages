import { analyzeTokenDataTypes } from './variable-data-types/analyzeTokenDataTypes.js';
import { binarySearch } from '../../binarySearch.js';
import { Command } from '../Command.js';
import { CommandCalls } from './CommandCalls.js';
import { compareProcedureLocationAndToken } from './compareProcedureLocationAndToken.js';
import { compareTokenLocations } from '../compareTokenLocations.js';
import { DataTypes } from '../data-types/DataTypes.js';
import { evaluateTokensBasic } from './variable-data-types/evaluateTokensBasic.js';
import { evaluateTokensWithVariables } from './variable-data-types/evaluateTokensWithVariables.js';
import { getAnalyzedVariables } from './variable-data-types/getAnalyzedVariables.js';
import { getParseTokensSorted } from '../getParseTokensSorted.js';
import { ParseTreeToken } from '../ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { ProcedureCallGraph } from './variable-data-types/ProcedureCallGraph.js';
import { scrapeProceduresFromParseTreeTokens } from './scrapeProceduresFromParseTreeTokens.js';
import { VariableScraper } from './VariableScraper.js';

/*
The CachedParseTree wraps a parse tree with various cached methods 
designed to improve performance for parse tree analysis.

Do not use CachedParseTree if you're mutating the underlying parse tree since 
the cache will be invalidated and methods will return incorrect results.
*/
export class CachedParseTree {
	constructor(treeRoot, proceduresMap, initialVariablesMap) {
		if (!(treeRoot instanceof ParseTreeToken))
			throw new Error('treeRoot must be a ParseTreeToken');
		if (!(proceduresMap instanceof Map))
			throw new Error('proceduresMap must be a Map');
		if (!(initialVariablesMap instanceof Map))
			throw new Error('initialVariablesMap must be a Map.  Not: ' + initialVariablesMap);

		this.root = treeRoot;
		this.proceduresMap = proceduresMap;
		this.initialVariablesMap = initialVariablesMap;
		this.tokensByType = [];
	}

	getAllGlobalVariablesMade() {
		if (this.globalVariables === undefined)
			this.globalVariables = VariableScraper.getGlobalVariableNamesMade(this.getAllTokens());
		return this.globalVariables;
	}

	getAllPossibleGlobalVariables() {
		if (this.possibleGlobalVariables === undefined) {
			this.possibleGlobalVariables = this.getVariables().getGlobalVariableNameSet();
		}
		return this.possibleGlobalVariables;
	}

	getAllTokens() {
		if (this.allTokens === undefined)
			this.allTokens = ParseTreeToken.flatten(this.root);

		return this.allTokens;
	}

	// Returns an Array of ParseTreeToken corresponding with all command calls 
	// from the wrapped parse tree
	getCommandCallsArray() {
		if (this.commandCallsArray === undefined) {
			const a = [];
			for (const [key, val] of this.getCommandCallsMap()) {
				a.push(val);
			}
			this.commandCallsArray = [].concat(...a);
		}
		return this.commandCallsArray;
	}

	getCommandCallsByName(primaryName) {
		if (this.getCommandCallsMap().has(primaryName))
			return this.getCommandCallsMap().get(primaryName);
		else
			return [];
	}

	getCommandCallsByNames(primaryNames) {
		return [].concat(...primaryNames.map(primaryName => this.getCommandCallsByName(primaryName)));
	}

	// returns a Map from primaryName to Array of ParseTreeToken
	getCommandCallsMap() {
		if (this.commandCalls === undefined) {
			this.commandCalls = new Map();
			const tokens = this.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP);
			for (let i = 0; i < tokens.length; i++) {
				const token = tokens[i];
				if (CommandCalls.isCommandCall(token)) {
					const info = Command.getCommandInfo(token.val);
					if (!this.commandCalls.has(info.primaryName))
						this.commandCalls.set(info.primaryName, [token]);
					else
						this.commandCalls.get(info.primaryName).push(token);
				}
			}
		}
		return this.commandCalls;
	}

	getLastToken() {
		if (this.lastToken === undefined) {
			if (this.sortedTokens !== undefined)
				this.lastToken = this.sortedTokens[this.sortedTokens.length - 1];
			else
				this.lastToken = this.root.getLastToken();
		}
		return this.lastToken;
	}

	getPossibleTypesFromToken(token) {
		const tokensToTypes = this.getTokensToDataTypes();
		const result = tokensToTypes.get(token);
		if (result === undefined)
			return new DataTypes('*'); // any type is possible when it is undefined/unknown.
		else
			return result;
	}

	// Returns undefined if token is not contained by a procedure implementation.
	getProcedureAtToken(token) {
		const procs = this.getProceduresStrictlyFromTree();
		if (procs.length === 0)
			return;
		// use binary search for a tiny performance benefit when there are many procedures.
		let index = binarySearch(procs, compareProcedureLocationAndToken, token, true);
		// Check procedures on either side of the found index.
		for (let offset = -1; offset <= 1; offset++) {
			const proc = procs[index + offset];
			if (proc !== undefined && proc.isContainingToken(token))
				return proc;
		}
	}

	// name is assumed to be in lower case.
	getProcedureByName(name) {
		return this.proceduresMap.get(name);
	}

	getProcedureCallGraph() {
		if (this.procedureCallGraph === undefined) {
			this.procedureCallGraph = new ProcedureCallGraph(this);
		}
		return this.procedureCallGraph;
	}

	getProcedureCallsByName(name) {
		name = name.toLowerCase();
		const procCallsMap = this.getProcedureCallsMap();
		if (procCallsMap.has(name))
			return procCallsMap.get(name);
		else
			return []; // no calls to the procedure
	}

	getProcedureCallsMap() {
		if (this.procedureCalls === undefined) {
			this.procedureCalls = new Map();
			const tokens = this.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP);
			for (let i = 0; i < tokens.length; i++) {
				const token = tokens[i];
				let procName = token.val.toLowerCase();
				if (Command.getCommandInfo(procName) === undefined) {
					if (!this.procedureCalls.has(procName))
						this.procedureCalls.set(procName, [token]);
					else
						this.procedureCalls.get(procName).push(token);
				}
			}
		}
		return this.procedureCalls;
	}

	getProcedureNamesStrictlyFromTree() {
		if (this.procedureNamesStrictlyFromTree === undefined)
			this.procedureNamesStrictlyFromTree = new Set(this.getProceduresStrictlyFromTree().map(proc => proc.name));
		return this.procedureNamesStrictlyFromTree;
	}

	getProceduresMap() {
		return this.proceduresMap;
	}

	getProceduresStrictlyFromTree() {
		if (this.proceduresStrictlyFromTree === undefined) {
			this.proceduresStrictlyFromTree = scrapeProceduresFromParseTreeTokens(this.getAllTokens());
			this.proceduresStrictlyFromTree.sort(compareProcedureLocationAndToken);
		}
		return this.proceduresStrictlyFromTree;
	}

	getSortedTokenIndex(token) {
		const result = binarySearch(this.getSortedTokens(), compareTokenLocations, token);
		if (typeof result === 'object')
			return -1; // indicate not found.
		return result;
	}

	getSortedTokens() {
		if (this.sortedTokens === undefined) {
			this.sortedTokens = this.getAllTokens();
			getParseTokensSorted(this.sortedTokens);
		}
		return this.sortedTokens;
	}

	getTokenImmediatelyAfter(token) {
		const i = this.getSortedTokenIndex(token);
		return this.sortedTokens[Math.min(this.sortedTokens.length - 1, i + 1)];
	}

	getTokenImmediatelyBefore(token) {
		const i = this.getSortedTokenIndex(token);
		return this.sortedTokens[Math.max(0, i - 1)];
	}

	getTokensByType(type) {
		if (this.tokensByType[type] === undefined)
			this.tokensByType[type] = this.getAllTokens().filter(t => t.type === type);
		return this.tokensByType[type];
	}

	getTokensByTypes(types) {
		return [].concat(...types.map(t => this.getTokensByType(t)));
	}

	getTokensToDataTypes() {
		if (this.tokensToDataTypes === undefined) {
			this.tokensToDataTypes = analyzeTokenDataTypes(this, this.getTokenValues(), this.getVariables());
		}
		return this.tokensToDataTypes;
	}

	getTokenValues() {
		if (this.tokenValues === undefined) {
			this.tokenValues = evaluateTokensBasic(this);
			evaluateTokensWithVariables(this, this.tokenValues, this.getVariables());
		}
		return this.tokenValues;
	}

	getTypesForVariableAtToken(variable, token) {
		return variable.getTypesAtToken(token);
	}

	getVariables() {
		if (this.variables === undefined) {
			this.variables = getAnalyzedVariables(this);
		}
		return this.variables;
	}
};