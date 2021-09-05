import { addLineNumber } from
'../../../components/code-editor/quality-report/addLineNumber.js';
import { analyzeCodeQuality } from
'../../../parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { BufferedParseLogger } from
'../../../parsing/loggers/BufferedParseLogger.js';
import { Code } from
'../Code.js';
import { getProceduresMap } from
'../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../parsing/LogoParser.js';
import { messageToDiv } from '../../messageToDiv.js';
import { MessageTypes } from
'../../MessageTypes.js';

function compareMessagesForSorting(message1, message2) {
	const lineIndex1 = message1.token.lineIndex;
	const lineIndex2 = message2.token.lineIndex;
	if (lineIndex1 < lineIndex2)
		return -1;
	else if (lineIndex1 > lineIndex2)
		return 1;

	return MessageTypes.compareUrgency(message1.type, message2.type);
}

export function addParseTreeAnalysisMessages(container, messageCount) {
	const parseLogger = new BufferedParseLogger();
	const tree = LogoParser.getParseTree(Code.getSourceCode(), parseLogger);
	if (tree !== undefined) {
		const initialVariablesMap = new Map();
		const proceduresMap = getProceduresMap(tree);
		analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap, {'isCompleteProgram': true});
	}
	const messages = parseLogger.getMessages();
	container.innerText = '';
	messages.sort(compareMessagesForSorting);
	for (const message of messages) {
		const div = messageToDiv(message.msg, message.type, message.isHTML);
		addLineNumber(div, message.token.lineIndex);
		container.appendChild(div);
	}
	messageCount.setCount(messages.length);
	return tree;
};