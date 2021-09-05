import { ArrayUtils } from
'../../../../../ArrayUtils.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function compareLineByStepNumber(line1, line2) {
	return compareSteps(lineToStepNumbers(line1),
		lineToStepNumbers(line2));
}

function compareSteps(step1, step2) {
	if (step1.page < step2.page)
		return -1;
	else if (step1.page > step2.page)
		return 1;
	if (step1.line < step2.line)
		return -1;
	else if (step1.line > step2.line)
		return 1;

	return 0; // indicate equal
}

function lineToStepNumbers(line) {
	const firstChild = line.children[0];
	const parts = firstChild.val.split('.');
	if (parts.length === 1)
		parts.push(''); // weird case but assume there is an empty line number.

	return {
		'page': parts[0],
		'line': parts[1]
	};
}

function hasStepNumber(lineOfCode) {
	const firstChild = lineOfCode.children[0];
	if (firstChild === undefined)
		return false;
	return firstChild.type === ParseTreeTokenType.NUMBER_LITERAL;
}

function lineToLet(lineOfCode) {
	for (const child of lineOfCode.children) {
		if (child.type === ParseTreeTokenType.LET) {
			return child;
		}
	}
}

function hasLet(lineOfCode) {
	return lineToLet(lineOfCode) !== undefined;
}

function letToName(lineOfCode) {
	const letToken = lineToLet(lineOfCode);
	if (letToken === undefined)
		return;

	const assignmentToken = letToken.children[0];
	if (assignmentToken === undefined ||
	assignmentToken.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return;

	const functionCallToken = assignmentToken.children[0];
	return functionCallToken.children[0].val.toLowerCase();
}

function getDistinctLetNames(letStatements) {
	const allNames = new Set();
	const duplicatedNames = new Set();
	for (const line of letStatements) {
		const letToken = lineToLet(line);
		const name = letToName(letToken);
		if (allNames.has(name))
			duplicatedNames.add(name);
		else
			allNames.add(name);
	}
	return new Set(Array.from(allNames).filter(name => !duplicatedNames.has(name)));
}

export function processTreeRoot(token, result) {
	const children = token.children;
	const linesWithSteps = children.filter(hasStepNumber);
	const letStatements = children.filter(hasLet);
	const distinctLetNames = Array.from(getDistinctLetNames(letStatements));
	const linesProcessed = new Set();
	distinctLetNames.sort();
	for (const letName of distinctLetNames) {
		const letStatement = letStatements.filter(line => letToName(line) === letName)[0];
		processToken(letStatement, result);
		linesProcessed.add(letStatement);
	}

	ArrayUtils.remove(linesWithSteps, line => !linesProcessed.has(line));
	linesWithSteps.sort(compareLineByStepNumber);
	let currentPage;
	for (const line of linesWithSteps) {
		const steps = lineToStepNumbers(line);
		if (currentPage !== steps.page) {
			if (currentPage !== undefined)
				result.append('\nend\n');

			currentPage = steps.page;
			result.append(`\nto page${currentPage}\n`);
		}
		processToken(line, result);
		linesProcessed.add(line);
	}
	if (currentPage !== undefined)
		result.append('\nend\n');
	
	for (const line of children) {
		if (!linesProcessed.has(line)) {
			processToken(line, result);
		}
	}
};