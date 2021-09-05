import { BufferedParseLogger } from
'../../modules/parsing/loggers/BufferedParseLogger.js';
import { CachedParseTree } from
'../../modules/parsing/parse-tree-analysis/CachedParseTree.js';
import { DataTypes } from
'../../modules/parsing/data-types/DataTypes.js';
import { getProceduresMap } from
'../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { getTokensByType } from
'../../modules/parsing/generic-parsing-utilities/getTokensByType.js';
import { LogoParser } from
'../../modules/parsing/LogoParser.js';
import { messageToDiv } from '../helpers/messageToDiv.js';
import { parseTreeTokenToElement } from
'../../modules/debugging/parse-tree-explorer/parseTreeTokenToElement.js';
import { ParseTreeTokenType } from
'../../modules/parsing/ParseTreeTokenType.js';
import { ready } from
'../../modules/ready.js';
import { refreshLineNumbers } from '../helpers/refreshLineNumbers.js';

let dataTypesContainer;

function updateDataTypes(types) {
	let s;
	if (types === undefined || types === null) {
		s = '';
	}
	else
		s = DataTypes.stringify(types);
	return function() {
		dataTypesContainer.innerText = s;
	}
}

function getTokenFromElement(element, cachedParseTree) {
	const typeName = element.querySelector('.type').innerText;
	const coords = element.querySelector('.coordinates').innerText.trim();
	const coordParts = coords.split(',').map(s => parseInt(s.trim())).filter(Number.isInteger);
	const type = ParseTreeTokenType.nameToNumber(typeName.trim());
	if (Number.isInteger(type) &&
	coordParts.length === 2) {
		const tokens = getTokensByType(cachedParseTree, type);
		const colIndex = coordParts[0];
		const lineIndex = coordParts[1];
		const matchingTokens = tokens.filter(t => t.lineIndex === lineIndex && t.colIndex === colIndex);
		if (matchingTokens.length === 1) {
			return matchingTokens[0];
		}
	}
}

function init() {
	const errorMessages = document.getElementById('error-messages');
	const lineNumberContainer = document.getElementById('code-input-line-numbers');
	const parseTreeContainer = document.getElementById('parse-tree-explorer');
	const input = document.getElementById('input');
	dataTypesContainer = document.getElementById('data-types');
	function refreshCodeOutputs() {
		const parseLogger = new BufferedParseLogger();
		const code = input.value;
		const tree = LogoParser.getParseTree(code, parseLogger);
		errorMessages.innerText = '';
		errorMessages.classList.remove('error');
		if (parseLogger.hasLoggedErrors()) {
			errorMessages.classList.add('error');
			parseLogger.getMessages().forEach(function(msg) {
				errorMessages.appendChild(messageToDiv(msg));
			});
		}
		refreshLineNumbers(lineNumberContainer, code);
		parseTreeContainer.innerText = '';
		if (tree !== undefined) {
			parseTreeContainer.appendChild(parseTreeTokenToElement(tree, ParseTreeTokenType));
			const proceduresMap = getProceduresMap(tree);
			const initialVariablesMap = new Map();
			const cachedParseTree = new CachedParseTree(tree, proceduresMap, initialVariablesMap);
			const tokenToTypes = cachedParseTree.getTokensToDataTypes();
			for (const node of parseTreeContainer.querySelectorAll('.parse-tree-token-heading')) {
				if (node instanceof Element) {
					const token = getTokenFromElement(node, cachedParseTree);
					if (token !== undefined) {
						const assignedTypes = tokenToTypes.get(token);
						node.addEventListener('mouseover', updateDataTypes(assignedTypes));
					}
				}
			}
		}
	}
	input.addEventListener('keyup', refreshCodeOutputs);
	input.addEventListener('input', refreshCodeOutputs);
}

ready(init);