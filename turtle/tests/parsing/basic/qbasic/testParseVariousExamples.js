import { analyzeQuality } from
'../../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { BufferedParseLogger } from
'../../../../modules/parsing/loggers/BufferedParseLogger.js';
import { getDescendentsOfType } from
'../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { parse } from
'../../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { indexToFilename, qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';

// The parser may struggle to distinguish integers as parameters and arithmetic
// from integer labels
function getUniqueIntegerLabel(usedLabels, lineIndex) {
	for (let i = 0; true; i++) {
		const newName = `${lineIndex * 10 + i}`;
		if (!usedLabels.has(newName))
			return newName;
	}
}

// The parser may struggle to distinguish valid identifiers from labels.
function getUniqueAlphaNumericLabel(usedLabels, lineIndex) {
	for (let i = 0; true; i++) {
		const newName = `label${lineIndex * 10 + i}:`;
		if (!usedLabels.has(newName))
			return newName;
	}
}

function addLabelsOnEveryLine(content, root, labelMaker) {
	const labels = getDescendentsOfType(root, ParseTreeTokenType.LABEL);
	labels.sort((t1, t2) => t1.lineIndex - t2.lineIndex);
	const lines = content.split('\n');
	const usedLabels = new Set(labels.map(label => label.val.toLowerCase()));
	let j = 0, i =0;
	for (; j < labels.length && i < lines.length; i++) {
		const line = lines[i];
		if (i < labels[j].lineIndex) {
			const newLabel = labelMaker(usedLabels, i);
			lines[i] = newLabel + ' ' + line;
			usedLabels.add(newLabel);
		}
		else {
			// do not insert a label for a line that already has one.
			j++;
		}
	}
	for (; i < lines.length; i++) {
		const line = lines[i];
		const newLabel = labelMaker(usedLabels, i);
		lines[i] = newLabel + ' ' + line;
		usedLabels.add(newLabel);
	}
	return lines.join('\n');
}

export function testParseVariousExamples(logger) {
	qbasicExamples.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index} filename=${indexToFilename(index)}`, logger);
		const parseResult = parse(content);
		if (typeof parseResult !== 'object')
			plogger(`Expected parse to return an object but found ${result}`);
		else {
			const parseLogger = new BufferedParseLogger();
			analyzeQuality(parseResult.root, parseLogger);
			if (parseLogger.hasLoggedErrors()) {
				plogger(`No errors expected but some found.  The messages were ${parseLogger.getMessages().map(m => m.msg + 'line ' + m.token.lineIndex).join(',')}`);
			}
			else {
				for (const labelMaker of [getUniqueIntegerLabel, getUniqueAlphaNumericLabel]) {
					// There shouldn't be any problem having a label on each and every line in a QBASIC program.
					// Check that the example parses without error when every line starts with a label.
					const labelsOnEveryLineContent = addLabelsOnEveryLine(content, parseResult.root, labelMaker);
					const parseResult2 = parse(labelsOnEveryLineContent);
					analyzeQuality(parseResult2.root, parseLogger);
					if (parseLogger.hasLoggedErrors()) {
						plogger(`No errors expected but some found.  The messages were ${parseLogger.getMessages().map(m => m.msg + 'line ' + m.token.lineIndex).join(',')}  The code was: ${labelsOnEveryLineContent}`);
						break;
					}
				}
			}
		}
	});
};