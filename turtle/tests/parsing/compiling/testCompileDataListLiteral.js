import { compileDataListLiteral } from '../../../modules/parsing/compiling/compileDataListLiteral.js';
import { DeepEquality } from '../../../modules/DeepEquality.js';
import { LogoInstruction } from '../../../modules/parsing/execution/instructions/LogoInstruction.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

export function testCompileDataListLiteral(logger) {
	const cases = [
		{'code': 'print []', 'instructionsDTO': [
			{'name': 'call-cmd', 'commandName': 'list', 'numArgs': 0,"skipValidationAndSanitization":false}
		]},
		{'code': 'print [1]', 'instructionsDTO': [
			{'name': 'push', 'value': 1, 'isCloningValue': false},
			{'name': 'call-cmd', 'commandName': 'list', 'numArgs': 1,"skipValidationAndSanitization":false}
		]},
		{'code': 'print [1 2]', 'instructionsDTO': [
			{'name': 'push', 'value': 1, 'isCloningValue': false},
			{'name': 'push', 'value': 2, 'isCloningValue': false},
			{'name': 'call-cmd', 'commandName': 'list', 'numArgs': 2,"skipValidationAndSanitization":false}
		]},
		{'code': 'print [1 sin 45]', 'instructionsDTO': [
			{'name': 'push', 'value': 1, 'isCloningValue': false},
			{'name': 'push', 'value': 45, 'isCloningValue': false},
			{'name': 'call-cmd', 'commandName': 'sin', 'numArgs': 1,"skipValidationAndSanitization":false},
			{'name': 'call-cmd', 'commandName': 'list', 'numArgs': 2,"skipValidationAndSanitization":false}
		]},
	];
	const procedures = new Map();
	cases.forEach(function(caseInfo) {
		const parseLogger = new TestParseLogger(logger, caseInfo.code);
		const tree = LogoParser.getParseTree(caseInfo.code, parseLogger);
		const dataListTokens = ParseTreeToken.flatten(tree).filter(function(token) {
			return token.type === ParseTreeTokenType.LIST;
		});
		if (dataListTokens.length !== 1)
			logger('Expected to find 1 list token but actually found ' + dataListTokens.length);
		else {
			const result = [];
			compileDataListLiteral(dataListTokens[0], procedures, result, parseLogger);
			if (result.length !== caseInfo.instructionsDTO.length)
				logger('Expected ' + caseInfo.instructionsDTO.length + ' but got ' + result.length + ' instructions');
			else {
				caseInfo.instructionsDTO.forEach(function(instructionDTO, index) {
					const prefixLogger = prefixWrapper(`instructionsDTO index ${index}`, logger);
					const actualDTO = result[index].toDTO();
					if (!DeepEquality.equals(actualDTO, instructionDTO))
						prefixLogger('Mismatched data transfer object for instruction at index ' +
							index + ', actualDTO = ' + JSON.stringify(actualDTO) +
							', expected DTO = ' + JSON.stringify(instructionDTO) +
							', full actual instructions for procedure are: ' + LogoInstruction.stringify(result));
				});
			}
		}
	});
};