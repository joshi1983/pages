import { DataTypes } from '../../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { findToken } from '../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { processRequiredTypes } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/processRequiredTypes.js';
await DataTypes.asyncInit();

export function testProcessRequiredTypes(logger) {
	const cases = [
	{'code': 'make "x []\nprint :X',
		'tokenInfo': {
			'val': 'X'
		},
		'inputRequiredTypes': '*',
		'containingProc': undefined,
		'expectedRequiredTypes': new DataTypes('*').toString(),
		'varName': 'x'
	},
	{'code': 'make "x []\nprint :X',
		'tokenInfo': {
			'val': 'X'
		},
		'inputRequiredTypes': 'list',
		'containingProc': undefined,
		'expectedRequiredTypes': 'list',
		'varName': 'x'
	},
	{'code': 'to p :x\njumpTo item 1 :X\nend',
		'tokenInfo': {
			'val': 'X'
		},
		'inputRequiredTypes': 'list',
		'containingProc': 'p',
		'expectedRequiredTypes': 'list(minlen=1)', 
		'varName': 'x'
	},
	{'code': 'to p :x\njumpTo item 2 :X\nend',
		'tokenInfo': {
			'val': 'X'
		},
		'inputRequiredTypes': 'list',
		'containingProc': 'p',
		'expectedRequiredTypes': 'list(minlen=2)', 
		'varName': 'x'
	},
	{'code': 'make "x pick [1.4 4 "hi [] easeInOut createPList] for ["i 1 :X] []',
		'tokenInfo': {
			'val': 'X'
		},
		'inputRequiredTypes': '*',
		'containingProc': undefined,
		'expectedRequiredTypes': 'num',
		'varName': 'x'
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const variables = cachedParseTree.getVariables();
		const tokens = cachedParseTree.getAllTokens();
		const token = findToken(caseInfo.tokenInfo, tokens, plogger);
		let containingProc = undefined;
		if (caseInfo.containingProc !== undefined) {
			containingProc = cachedParseTree.getProcedureByName(caseInfo.containingProc);
			if (containingProc === undefined)
				plogger(`Expected to find procedure with name ${caseInfo.containingProc} but it was not found`);
		}
		processRequiredTypes(token, caseInfo.inputRequiredTypes, variables, containingProc);
		const variable = variables.getVariableByName(caseInfo.varName);
		if (variable.scopes.length !== 1) {
			plogger(`Expected exactly 1 scope but found ${variable.scopes.length}`);
		}
		else {
			const scope = variable.scopes[0];
			const finalRequiredTypesString = scope.requiredTypes.toString();
			if (caseInfo.expectedRequiredTypes !== finalRequiredTypesString)
				plogger(escapeHTML(`Expected ${caseInfo.expectedRequiredTypes} but got ${finalRequiredTypesString}`));
		}
	});
};