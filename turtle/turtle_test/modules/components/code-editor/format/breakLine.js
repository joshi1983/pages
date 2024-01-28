import { LoggedSection } from './LoggedSection.js';
import { ParseTreeTokenType } from '../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../parsing/Procedure.js';
import { tabSpaceEquivalent, maxLineLength } from './formatConstants.js';

function getLineLengthFromString(s) {
	if (typeof s !== 'string')
		throw new Error('s must be a string');
	let total = 0;
	for (let i = 0; i < s.length; i++) {
		if (s[i] === '\t')
			total += tabSpaceEquivalent;
		else
			total++;
	}
	return total;
}

function getLineLength() {
	if (typeof arguments[0] === 'string')
		return getLineLengthFromString(arguments[0]);
	else if (typeof arguments[0] === 'number' && arguments[1] instanceof Array)
		return arguments[0] * tabSpaceEquivalent + getLineLengthFromString(LoggedSection.getStringFromSections(arguments[1]));
	else
		throw new Error('Invalid arguments passed to getLineLength.  A (string) or a (number, Array of LoggedSection) are required');
}

function doesLineNeedToBreak() {
	return getLineLength(...arguments) > maxLineLength;
}

function containsASpace(s) {
	return s.indexOf(' ') !== -1;
}

/*
Checks if the logged sections correspond with a line that can be broken without 
introducing errors in a Logo program.
*/
function canBeBroken(loggedSections) {
	if (loggedSections.length === 0 || (loggedSections.length === 1 && !containsASpace(loggedSections[0].s)))
		return false;

	// if none of the sections can be separated by spaces except the first one, we can't break into more lines.
	if (loggedSections.filter((s, index) => index !== 0 && s.isSpacePrefixed === false).length === loggedSections.length)
		return false;

	// can not break to procName and parameter list to more than one line.
	if (loggedSections[0].token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
		if (loggedSections.length === 1)
			return false; // If "to procName1" was together in 1 section, it must stay together on the same line.
		else if (loggedSections.length === 2 && loggedSections[1].type === ParseTreeTokenType.LEAF)
			return false; // For example, "to" "procName1" must be on the same line.
		else {
			for (let i = 1; i < loggedSections.length; i++) {
				const tok = loggedSections[i].token;
				// if not a name token in its proper place
				if (i > 1 || tok.type !== ParseTreeTokenType.LEAF) {
					// if tok is not a parameter token, we found something to break at.
					if (Procedure.isParameterToken(tok) === false)
						return true; // if anything other than variable read tokens(also used for parameters), 
				}
			}
		}
	}
	else
		return true;

	return false;
}

function mergeUnbreakableSections(loggedSections) {
	const result = [];
	let currentSections = [];
	loggedSections.forEach(function(section, index) {
		currentSections.push(section);
		if (canBeBroken(currentSections)) {
			currentSections.pop();
			if (currentSections.length > 0)
				result.push(LoggedSection.createByJoining(currentSections));
			currentSections = [section];
		}
	});
	if (currentSections.length !== 0)
		result.push(LoggedSection.createByJoining(currentSections));
	return result;
}

function getSingleLineString(indentation, sections) {
	if (typeof indentation !== 'number')
		throw new Error('indentation must be a number');
	if (!(sections instanceof Array))
		throw new Error('sections must be an Array');

	let indentationS = '';
	for (let i = 0; i < indentation; i++) 
		indentationS += '\t';
	return indentationS + LoggedSection.getStringFromSections(sections);
}

function explode(sections) {
	const result = [];
	sections.forEach(function(section) {
		section.explode().forEach(function(explodedSection) {
			result.push(explodedSection);
		});
	});
	
	return result;
}

function getBestBreakIndex(sections) {
	if (!(sections instanceof Array))
		throw new Error('sections must be an Array');

	const maxDepth = Math.max(...sections.map(s => s.token.getDepth()));
	let maxHeuristic = 0;
	let bestIndex = 1;
	for (let i = 1; i < sections.length; i++) {
		/*
		This heuristic multiplies by i to represent a preference for larger indexes that include more sections.

		This heuristic multiplies by maxDepth - token depth to represent a preference for more shallow tokens.
		Shallow tokens represent operations in a parse tree that would be done last such as a + operation.
		*/
		const splitQualityHeuristic = i * (1 + maxDepth - sections[i].token.getDepth());
		if (maxHeuristic < splitQualityHeuristic) {
			maxHeuristic = splitQualityHeuristic;
			bestIndex = i;
		}
	}
	return bestIndex + 1;
}

/*
Returns an Array of string.
Each string represents lines that are short enough or as close to short enough as 
possible without violating WebLogo's rules.
*/
export function breakLine(indentation, loggedSections) {
	if (typeof indentation !== 'number')
		throw new Error('indentation must be a number');
	if (!(loggedSections instanceof Array))
		throw new Error('loggedSections must be an Array');
	let s = getSingleLineString(indentation, loggedSections);
	if (doesLineNeedToBreak(indentation, loggedSections) && canBeBroken(loggedSections)) {
		loggedSections = mergeUnbreakableSections(loggedSections);
		loggedSections = explode(loggedSections);
		const result = [];
		const currentSections = [];
		for (let i = 0; i < loggedSections.length; i++) {
			const section = loggedSections[i];
			currentSections.push(section);
			s = getSingleLineString(indentation, currentSections);
			if (doesLineNeedToBreak(s)) {
				const breakIndex = getBestBreakIndex(currentSections);
				result.push(getSingleLineString(indentation, currentSections.slice(0, breakIndex)));
				currentSections.splice(0, breakIndex); // remove the elements that were processed.
			}
		}
		if (currentSections.length !== 0)
			result.push(getSingleLineString(indentation, currentSections));
		return result;
	}
	else {
		return [s];
	}
};