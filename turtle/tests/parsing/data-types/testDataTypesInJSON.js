import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { fetchJson } from '../../../modules/fetchJson.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';
const operators = await fetchJson('json/operators.json');
const commands = await fetchJson('json/commands.json');

function processTypes(types, logger) {
	try {
		DataTypes.parse(types);
	}
	catch (e) {
		console.error(e);
		logger('Failure while parsing ' + types + ', error: ' + e);
	}
}

function testCommandsJSON(logger) {
	commands.forEach(function(commandInfo, index) {
		const prefixedLogger = prefixWrapper('Command ' + commandInfo.primaryName + ', index ' + index, logger);
		processTypes(commandInfo.returnTypes, prefixedLogger);
		commandInfo.args.forEach(function(arg) {
			processTypes(arg.types, prefixedLogger);
		});
	});
}

function testOperatorsJSON(logger) {
	operators.forEach(function(operatorInfo, index) {
		const prefixedLogger = prefixWrapper('index ' + index, logger);
		processTypes(operatorInfo.returnTypes, prefixedLogger);
		operatorInfo.args.forEach(function(argTypes) {
			processTypes(argTypes, prefixedLogger);
		});
		if (operatorInfo.unary !== undefined) {
			if (typeof operatorInfo !== 'object')
				logger('unary must either be undefined or an object.  Not ' + operatorInfo.unary);
			else {
				if (typeof operatorInfo.unary.name !== 'string')
					logger('unary.name must be a string');
				if (typeof operatorInfo.unary.arg !== 'string')
					logger('unary.arg must be a string');
				else
					processTypes(operatorInfo.unary.arg, prefixedLogger);
				if (typeof operatorInfo.unary.returnTypes !== 'string')
					logger('unary.returnTypes must be a string');
				else
					processTypes(operatorInfo.unary.returnTypes, prefixedLogger);
			}
		}
	});
}

export function testDataTypesInJSON(logger) {
	wrapAndCall([
		testCommandsJSON,
		testOperatorsJSON
	], logger);
};