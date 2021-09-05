import { Command } from
'../../Command.js';
import { fetchJson } from
'../../../fetchJson.js';
import { ParseTreeTokenType} from './ParseTreeTokenType.js';
await Command.asyncInit();

const migration = await fetchJson('json/logo-migrations/basic/qbasic/migration.json');
const all = migration.operators;
const possibleUnaries = new Set(['-']);
const definitelyUnaries = new Set();
const operatorsMap = new Map();
all.forEach(function(opInfo) {
	operatorsMap.set(opInfo.symbol, opInfo);
	if (opInfo.convertToCommand !== undefined) {
		const commandInfo = Command.getCommandInfo(opInfo.convertToCommand);
		const count = Command.getArgCount(commandInfo);
		if (count.isFlexible === false && count.defaultCount === 1) {
			possibleUnaries.add(opInfo.symbol.toLowerCase());
			definitelyUnaries.add(opInfo.symbol.toLowerCase());
		}
	}
});

export class QBasicOperators {
	static compareOperatorPrecedence(op1, op2, token1, token2) {
		if (token1.type !== token2.type) {
			if (token1.type === ParseTreeTokenType.ASSIGNMENT)
				return -1; // always do assignments after binary operations.
			else
				return 1;
		}
		op1 = QBasicOperators.getOperatorInfo(op1);
		op2 = QBasicOperators.getOperatorInfo(op2);
		return op1.precedence - op2.precedence;
	}

	static getAllOperatorsInfo() {
		return all;
	}

	static getOperatorInfo(symbol) {
		return operatorsMap.get(symbol.toLowerCase());
	}

	static isOnlyUnary(symbol) {
		return definitelyUnaries.has(symbol.toLowerCase());
	}

	static mightBeUnary(symbol) {
		return possibleUnaries.has(symbol.toLowerCase());
	}
};