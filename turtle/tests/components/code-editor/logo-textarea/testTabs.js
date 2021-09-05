import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Tabs } from '../../../../modules/components/code-editor/logo-textarea/Tabs.js';

function testInsertTabs(logger) {
	const cases = [
		{'in': '', 'out': '\t'},
		{'in': 'hello', 'out': '\thello'},
		{'in': 'hello\n', 'out': '\thello\n'},
		{'in': 'hello\nhi', 'out': '\thello\n\thi'},
		{'in': ' hello', 'out': '\t hello'},
		{'in': '\thello', 'out': '\t\thello'},
	];
	cases.forEach(function(caseInfo) {
		const result = Tabs.insertTabs(caseInfo.in);
		if (result !== caseInfo.out)
			logger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
}

function testLeftTrimTab(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'hello', 'out': 'hello'},
		{'in': ' hello', 'out': 'hello'},
		{'in': '   hello', 'out': 'hello'},
		{'in': '    hello', 'out': 'hello'},
		{'in': '     hello', 'out': ' hello'},
		{'in': '    \thello', 'out': '    hello'},
		{'in': '\thello', 'out': 'hello'},
		{'in': '\t\thello', 'out': '\thello'},
		{'in': '\t hello', 'out': ' hello'},
	];
	cases.forEach(function(caseInfo) {
		const result = Tabs.leftTrimTab(caseInfo.in);
		if (result !== caseInfo.out)
			logger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
}

function testRemoveTabs(logger) {
	const cases = [
		{'in': 'hello', 'out': 'hello'},
		{'in': ' hello', 'out': 'hello'},
		{'in': '   hello\n\t\thi', 'out': 'hello\n\thi'},
	];
	cases.forEach(function(caseInfo) {
		const result = Tabs.removeTabs(caseInfo.in);
		if (result !== caseInfo.out)
			logger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
}

export function testTabs(logger) {
	testInsertTabs(prefixWrapper('testInsertTabs', logger));
	testLeftTrimTab(prefixWrapper('testLeftTrimTab', logger));
	testRemoveTabs(prefixWrapper('testRemoveTabs', logger));
};