import { getTokensByType } from '../../../../../parse-tree-analysis/cached-parse-tree/getTokensByType.js';
import { isPossiblyDefining } from './undefined-identifiers/isPossiblyDefining.js';
import { isPossiblyUndefined } from './undefined-identifiers/isPossiblyUndefined.js';
import { mightScopeInclude } from './undefined-identifiers/mightScopeInclude.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateUndefinedIdentifiers(cachedParseTree, parseLogger) {
	const identifierTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.IDENTIFIER);
	const identifiersDeclared = identifierTokens.filter(isPossiblyDefining);
	const definedIdentifiers = new Map();
	identifiersDeclared.forEach(function(idToken) {
		let val = definedIdentifiers.get(idToken.val);
		if (val === undefined) {
			val = [];
			definedIdentifiers.set(idToken.val, val);
		}
		val.push(idToken);
	});
	const identifiersDeclaredSet = new Set(identifiersDeclared);
	const identifiers = identifierTokens.filter(t => !identifiersDeclaredSet.has(t)).filter(isPossiblyUndefined);
	identifiers.forEach(function(identifierToken) {
		if (!definedIdentifiers.has(identifierToken.val)) {
			parseLogger.error(`Undefined identifier ${identifierToken.val}`, identifierToken);
		}
		else {
			// a variable by the same name is declared somewhere in the module.
			// Is it declared but not at the location of identifierToken?
			if (!definedIdentifiers.get(identifierToken.val).some(mightScopeInclude(identifierToken))) {
				parseLogger.error(`Identifier ${identifierToken.val} is defined somewhere in the module but not at the point of reading.`, identifierToken);
			}
		}
	});
};