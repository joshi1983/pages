import { Highlighter } from '../../../../modules/components/syntax-highlighter/highlighters/Highlighter.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

function checkAddLinesToContainerHTML(numLinesPerGroup, html, numGroups, logger) {
	const containerID = 'highlighter-container-234';
	const result = Highlighter.addLinesToContainerHTML(containerID, html, numLinesPerGroup);
	const e = document.createElement('div');
	e.innerHTML = result;
	const selector = Highlighter.getLineGroupIDSelector(containerID);
	const lineGroups = e.querySelectorAll(selector);
	if (lineGroups.length !== numGroups)
		logger(`Expected number of groups to be ${numGroups} but got ${lineGroups.length}`);
}

function testAddLinesToContainerHTML(logger) {
	const cases = [{
		'html': 'fd 100',
		'numLines': 1
	},
	{
		'html': 'fd 100\nright 90',
		'numLines': 2
	}, {
		'html': 'fd 100\nright 90\nfd 150',
		'numLines': 3
	}];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		checkAddLinesToContainerHTML(1, caseInfo.html, caseInfo.numLines, plogger);
		checkAddLinesToContainerHTML(2, caseInfo.html, Math.ceil(caseInfo.numLines / 2), plogger);
	});
}

function testFormatLineGroupID(logger) {
	const cases = [
		{'inArgs': ['hi', 1], 'out': 'hi-highlighter-lines-from-1'}
	];
	testInOutPairs(cases, Highlighter.formatLineGroupID, logger);
}

function testGetLineNumberFromLineGroupID(logger) {
	const cases = [
		{'in': 'hi-highlighter-lines-from-5', 'out': 5},
		{'in': 'hi-highlighter-lines-from-15', 'out': 15}
	];
	testInOutPairs(cases, Highlighter.getLineNumberFromLineGroupID, logger);
}

function testProcess(logger) {
	const container = document.createElement('pre');
	Highlighter.process(container);
}

function testRemoveLineGroups(logger) {
	const cases = [
		{'numLines': 0, 'startLineIndex': 0, 'innerTextLengthToRemove': 0, 'result': false},
		{'numLines': 5, 'startLineIndex': 0, 'innerTextLengthToRemove': 1, 'resultLineGroupCount': 1, 'result': false},
		{'numLines': 15, 'startLineIndex': 10, 'innerTextLengthToRemove': 1, 'resultLineGroupCount': 2, 'result': false},
		{'numLines': 16, 'startLineIndex': 10, 'innerTextLengthToRemove': 1, 'result': false},
		{'numLines': 25, 'startLineIndex': 10, 'innerTextLengthToRemove': 10, 'resultLineGroupCount': 2, 'result': true},
	];
	const numLinesPerGroup = 10;
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const container = document.createElement('pre');
		container.setAttribute('id', 'test-container-id');
		container.innerHTML = Highlighter.addLinesToContainerHTML(container.id, '\n'.repeat(caseInfo.numLines), numLinesPerGroup);
		const result = Highlighter.removeLineGroups(container, caseInfo.startLineIndex, caseInfo.innerTextLengthToRemove, numLinesPerGroup);
		const selector = Highlighter.getLineGroupIDSelector(container.id);
		const groups = container.querySelectorAll(selector);
		if (caseInfo.resultLineGroupCount !== undefined && groups.length !== caseInfo.resultLineGroupCount) {
			plogger(`Expected ${caseInfo.resultLineGroupCount} line groups but got ${groups.length}`);
		}
		if (result !== caseInfo.result)
			plogger(`Expected result to be ${caseInfo.result} but got ${result}`);
	});
}

function testUndoAddLinesToContainer(logger) {
	const cases = [
		'', 'hello world', 'hello <strong>w</strong>orld'
	];
	const id = 'test-container';
	const selector = Highlighter.getLineGroupIDSelector(id);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const pre = document.createElement('pre');
		pre.id = id;
		const html = caseInfo;
		pre.innerHTML = Highlighter.addLinesToContainerHTML(id, html);
		Highlighter.undoAddLinesToContainer(pre);
		const newHTML = pre.innerHTML;
		if (newHTML !== html)
			plogger(`Expected HTML to be ${html} but got ${newHTML}`);
		const firstLineGroup = pre.querySelector(selector);
		if (firstLineGroup !== null)
			plogger(`Expected there to be no line groups after undoAddLinesToContainer but found: ${firstLineGroup}`);
	});
}

export function testHighlighter(logger) {
	testAddLinesToContainerHTML(prefixWrapper('testAddLinesToContainerHTML', logger));
	testFormatLineGroupID(prefixWrapper('testFormatLineGroupID', logger));
	testGetLineNumberFromLineGroupID(prefixWrapper('testGetLineNumberFromLineGroupID', logger));
	testProcess(prefixWrapper('testProcessAllLines', logger));
	testRemoveLineGroups(prefixWrapper('testRemoveLineGroups', logger));
	testUndoAddLinesToContainer(prefixWrapper('testUndoAddLinesToContainer', logger));
};