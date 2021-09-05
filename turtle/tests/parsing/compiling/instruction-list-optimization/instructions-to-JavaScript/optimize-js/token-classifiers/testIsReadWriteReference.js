import { flatten } from
'../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getWebLogoVariableNameFromVariableReference } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/getWebLogoVariableNameFromVariableReference.js';
import { isReadWriteReference } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isReadWriteReference.js';
import { parse } from
'../../../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from '../../../../../../helpers/prefixWrapper.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

/*
getWebLogoVariableNameFromVariableReference is in a different directory but
testing it together with isReadWriteReference seemed convenient since they're closely related and 
getWebLogoVariableNameFromVariableReference depends heavily on isReadWriteReference.
*/
function testGetWebLogoVariableNameFromVariableReference(cases, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const parseResult = parse(caseInfo.code);
		const allTokens = flatten(parseResult.root);
		const readWriteRefTokens = allTokens.filter(isReadWriteReference);
		const foundNames = new Set(readWriteRefTokens.map(token => getWebLogoVariableNameFromVariableReference(token)));
		caseInfo.names.forEach(function(name) {
			if (!foundNames.has(name)) {
				plogger(`Expected to find the name ${name} but did not.  All the found names are ${Array.from(foundNames).join(',')}`);
			}
		});
	});
}

export function testIsReadWriteReference(logger) {
	const cases = [
	{
		'code': '', 'numResults': 0
	}, {
		'code': 'context.make("x", 4)', 'numResults': 0
	}, {
		'code': 'context.turtle.print("x")', 'numResults': 0
	}, {
		'code': 'context.localmake("x", 4)', 'numResults': 0
	}, {
		'code': 'context.queue("x", 4)', 'numResults': 1,
		'names': ['x']
	}, {
		'code': 'context.queue2("x", 4)', 'numResults': 0 
		// wrong command group since queue2 is in the list command group.  not compiled.
	}, {
		'code': 'context.list.queue2("x", 4)', 'numResults': 1,
		'names': ['x']
	}, {
		'code': 'context.list.dequeue("x")', 'numResults': 0
		// wrong command group since dequeue is compiled.
	}, {
		'code': 'context.dequeue("x")', 'numResults': 1,
		// correct command group since dequeue is compiled.
		'names': ['x']
	}, {
		'code': 'context.array.setItem(2, "x", "hello world")', 'numResults': 1
	}
	];
	testGetWebLogoVariableNameFromVariableReference(cases.filter(caseInfo => caseInfo.names !== undefined), prefixWrapper(`testGetWebLogoVariableNameFromVariableReference`, logger));
	processTokenCheckTests(cases, isReadWriteReference, logger);
};