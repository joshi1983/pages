import { Command } from '../modules/parsing/Command.js';
import { fetchJson } from '../modules/fetchJson.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
const operators = await fetchJson('json/operators.json');

export function testOperatorsJSON(logger) {
	if (!(operators instanceof Array))
		logger('Expected operators.json to define an Array.  operators = ' + operators);
	else {
		const operatorSymbols = new Set(
			operators.filter(op => 
					typeof op === 'object' &&
					typeof op.symbol === 'string'
				).
				map(op => op.symbol));
		operators.forEach(function(info, index) {
			const plogger = prefixWrapper(`Element at index ${index}`, logger);
			if (typeof info !== 'object')
				plogger('Every element in operators.json Array expected to be an object.  info=' + info);
			else {
				if (typeof info.description !== 'string')
					plogger('Expected description to be a string but got ' + info.description);
				if (typeof info.returnTypes !== 'string')
					plogger('Expected returnTypes to be a string.  Got: ' + info.returnTypes);
				if (typeof info.symbol !== 'string')
					plogger('symbol expected to be a string.  Got: ' + info.symbol);
				if (!(info.args instanceof Array))
					plogger('args expected to be an Array but got: ' + info.args);
				else if (info.args.length !== 2)
					plogger('args.length expected to be 2 but got: ' + info.args.length);
				if (typeof info.name !== 'string')
					plogger('name expected to be a string but got: ' + info.name);
				if (typeof info.precedence !== 'number')
					plogger('precedence expected to be a number but got: ' + info.precedence);
				if (info.similarCommand !== null) {
					if (typeof info.similarCommand !== 'string')
						plogger('similarCommand expected to either be a string or null but got: ' + info.similarCommand);
					else if (Command.getCommandInfo(info.similarCommand) === undefined)
						plogger(`similarCommand must exist if specified.  Unable to find command information for "${info.similarCommand}"`);
				}
				if (info.notSymbol !== undefined) {
					if (typeof info.notSymbol !== 'string')
						plogger('notSymbol expected to either be undefined or a string but got: ' + info.notSymbol);
					else if (!operatorSymbols.has(info.notSymbol))
						plogger(`notSymbol must match another operator's symbol but no match was found for notSymbol "${info.notSymbol}"`);
				}
				if (info.unary !== undefined) {
					if (typeof info.unary !== 'object')
						plogger('unary must either be an object or be undefined but got: ' + info.unary);
					else {
						const unaryInfo = info.unary;
						if (typeof unaryInfo.description !== 'string')
							plogger('unary.description expected to be a string but got ' + unaryInfo.description);
						if (typeof unaryInfo.name !== 'string')
							plogger('unary.name expected to be a string but got: ' + unaryInfo.name);
						if (typeof unaryInfo.arg !== 'string')
							plogger('unary.arg expected to be a string but got: ' + unaryInfo.arg);
						if (typeof unaryInfo.returnTypes !== 'string')
							plogger('unary.returnTypes expected to be a string but got: ' + unaryInfo.returnTypes);
					}
				}
			}
		});
	}
};