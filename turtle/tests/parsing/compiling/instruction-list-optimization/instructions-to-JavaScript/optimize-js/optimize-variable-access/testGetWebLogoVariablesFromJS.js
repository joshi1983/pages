import { flatten } from
'../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getWebLogoVariablesFromJS } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/getWebLogoVariablesFromJS.js';
import { parse } from
'../../../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';

export function testGetWebLogoVariablesFromJS(logger) {
	const cases = [{
		'code': '',
		'numResults': 0,
		'numMakeTokens': 0,
		'numSetTokens': 0
	}, {
		'code': 'let size = localVariables.get("size");',
		'numResults': 1,
		'names': ['size'],
		'varInfoChecks': [{
			'name': 'size',
			'numAssignTokens': 1,
			'numReadTokens': 1,
			'numMakeTokens': 0,
			'numSetTokens': 0
		}]
	}, {
		'code': 'localVariables.set("size", 4);',
		'numResults': 1,
		'names': ['size'],
		'varInfoChecks': [{
			'name': 'size',
			'numAssignTokens': 0,
			'numReadTokens': 0,
			'numMakeTokens': 0,
			'numSetTokens': 1
		}]
	}, {
		'code': 'globalVariables.set("size", 4);',
		'numResults': 1,
		'names': ['size'],
		'varInfoChecks': [{
			'name': 'size',
			'numAssignTokens': 0,
			'numReadTokens': 0,
			'numMakeTokens': 0,
			'numSetTokens': 1
		}]
	}, {
		'code': 'let size = context.globalVariables.get("size");',
		'numResults': 1,
		'names': ['size'],
		'varInfoChecks': [{
			'name': 'size',
			'numAssignTokens': 1,
			'numReadTokens': 1,
			'numMakeTokens': 0,
			'numSetTokens': 0
		}]
	}, {
		'code': 'let size = globalVariables.get("size");',
		'numResults': 1,
		'names': ['size'],
		'varInfoChecks': [{
			'name': 'size',
			'numAssignTokens': 1,
			'numReadTokens': 1,
			'numMakeTokens': 0,
			'numSetTokens': 0
		}]
	}, {
		'code': 'let size = context.readVariable("size");',
		'numResults': 1,
		'names': ['size'],
		'varInfoChecks': [{
			'name': 'size',
			'numAssignTokens': 1,
			'numReadTokens': 1,
			'numMakeTokens': 0,
			'numSetTokens': 0
		}]
	}, {
		'code': 'let size = context.readVariable("size");context.turtle.forward(size)',
		'numResults': 1,
		'names': ['size'],
		'varInfoChecks': [{
			'name': 'size',
			'numAssignTokens': 1,
			'numReadTokens': 2,
			'numMakeTokens': 0,
			'numSetTokens': 0
		}]
	}, {
		'code': 'let size = context.readVariable("size");let size2 = context.readVariable("size")',
		'numResults': 1,
		'names': ['size'],
		'varInfoChecks': [{
			'name': 'size',
			'numAssignTokens': 2,
			'numReadTokens': 2,
			'numMakeTokens': 0,
			'numSetTokens': 0
		}]
	},
	{'code': `let x = context.readVariable("x");
context.turtle.print( x );
x= x + 1 ;
context.valueStack.push(context.readVariable("x") < 3);
context.make("x", x);`,
	'numResults': 1,
	'names': ['x'],
	'varInfoChecks': [
		{'name': 'x', 'numReadTokens': 5, 'numAssignTokens': 2, 'numMakeTokens': 1,
			'numSetTokens': 0}
	]},
	{'code': `context.make("animationratio",3);
context.turtle.print(animationratio);
let animationratio = context.readVariable("animationratio");
context.make("animationratio", animationratio);`,
	'numResults': 1,
	'names': ['animationratio'],
	'varInfoChecks': [
		{'name': 'animationratio', 'numReadTokens': 3, 'numAssignTokens': 1, 'numMakeTokens': 2,
			'numSetTokens': 0}
	]},
	{'code': `localVariables.get("numintervals");let numintervals=context.readVariable("numintervals")`,
		'numResults': 1,
		'names': ['numintervals'],
		'varInfoChecks': [
			{'name': 'numintervals', 'numReadTokens': 2, 'numAssignTokens': 1, 'numMakeTokens': 0,
				'numSetTokens': 0}
		]
	},
	{'code': `let x = localVariables.get("x"); x=4;`,
		'numResults': 1,
		'names': ['x'],
		'varInfoChecks': [
			{'name': 'x', 'numReadTokens': 1, 'numAssignTokens': 2, 'numMakeTokens': 0}
		]
	},
	{'code': `if (!(context.readVariable("colorindex") > 0)) {
context.localmake("colorindex", context.getCurrentExecutingProcedure().localVariables.get("colorindex") + 1);
}
let colorindex = context.getCurrentExecutingProcedure().localVariables.get("colorindex");
context.turtle.setFillColor(this.convertToAlphaColourOrTransparent(context.list.item(colorindex ,context.globalVariables.get("colors"))));
context.valueStack.push(context.readVariable("size") * 0.38197);
context.valueStack.push(colorindex - 1);`,
		'numResults': 1,
		'names': ['colorindex'],
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code = ${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const allTokens = flatten(parseResult.root);
		const result = getWebLogoVariablesFromJS(allTokens);
		if (result.size !== caseInfo.numResults)
			plogger(`Expected number of results to be ${caseInfo.numResults} but got ${result.size}`);
		else {
			if (caseInfo.names instanceof Array)
				caseInfo.names.forEach(function(name) {
					if (!result.has(name))
						plogger(`Expected to find WebLogo variable name ${name} but did not.  The found names are ${Array.from(result.keys).join(', ')}`);
				});
			else if (caseInfo.names !== undefined)
				plogger(`Test info is bad.  names must either be an Array or undefined but got ${caseInfo.names}`);
		}
		if (caseInfo.varInfoChecks instanceof Array) {
			caseInfo.varInfoChecks.forEach(function(checkInfo, cIndex) {
				const clogger = prefixWrapper(`Check ${cIndex}, name=${checkInfo.name}`, plogger);
				const info = result.get(checkInfo.name);
				if (info === undefined)
					clogger(`Expected to find info for ${checkInfo.name} but not found`);
				else {
					if (!(info.makeTokens instanceof Array))
						clogger(`Expected makeTokens to be an Array but got ${info.makeTokens}`);
					else if (info.makeTokens.length !== checkInfo.numMakeTokens)
						clogger(`Expected makeTokens.length to be ${checkInfo.numMakeTokens} but got ${info.makeTokens.length}`);
					if (Number.isInteger(checkInfo.numReadTokens) && checkInfo.numReadTokens !== info.readTokens.length) {
						clogger(`Expected to find ${checkInfo.numReadTokens} read tokens but found ${info.readTokens.length}`);
					}
					if (Number.isInteger(checkInfo.numAssignTokens) && checkInfo.numAssignTokens !== info.assignTokens.length)
						clogger(`Expected to find ${checkInfo.numAssignTokens} assignTokens but found ${info.assignTokens.length}`);
					if (Number.isInteger(checkInfo.numSetTokens) && checkInfo.numSetTokens !== info.setTokens.length)
						clogger(`Expected to find ${checkInfo.numSetTokens} setTokens but got ${info.setTokens.length}`);
				}
			});
		}
	});
};