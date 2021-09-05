import { checkTreeInfo } from './checkTreeInfo.js';
import { prefixWrapper } from '../prefixWrapper.js';

export function wrapSingleTreeInfoObject(obj) {
	return {
		'val': null,
		'children': [
			obj
		]
	};
};

function tokenToDescription(token, ParseTreeTokenType) {
	return `token.val=${token.val}, lineIndex=${token.lineIndex}, colIndex=${token.colIndex}, ` +
		`type=${token.type}, type name = ${ParseTreeTokenType.getNameFor(token.type)}`;
}

function validateTokenInGeneral(token, logger, ParseTreeTokenType) {
	if (typeof token !== 'object' || token === null)
		logger(`Token must be an object but found ${token}`);
	else if (!(token.children instanceof Array))
		logger(`token.children must be an Array but children= ${token.children}`);
	else {
		// If a problem is found, we want to stop the validation
		// to prevent unhelpful noise in the test report.
		let problemFound = false;
		for (const child of token.children) {
			if (child === token) {
				logger(`Cycle found.  A token's child should never be the same as the token.  ` +
				tokenToDescription(token, ParseTreeTokenType));
				problemFound = true;
			}
			else if (typeof child !== 'object' || child === null ||
			!(child.children instanceof Array)) {
				logger(`Every child must be a ParseTreeToken.  child=${child}.  token/parent: ${tokenToDescription(token, ParseTreeTokenType)}`);
				problemFound = true;
			}
			else {
				for (const grandChild of child.children) {
					if (token === grandChild) {
						logger(`Cycle found.  A token's grand child should never be the same as the token.  ` +
						tokenToDescription(token, ParseTreeTokenType));
						problemFound = true;
					}
				}
			}
			if (!problemFound)
				validateTokenInGeneral(child, logger, ParseTreeTokenType);
		}
	}
}

export function processParseTestCases(cases, parse, ParseTreeTokenType, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code, caseInfo.parseSettings);
		if (typeof parseResult !== 'object' || parseResult === null)
			plogger(`Expected parse result to be an object but got ${parseResult}`);
		else if (!(parseResult.comments instanceof Array))
			plogger(`Expected parseResult.comments to be an Array but got ${parseResult.comments}`);
		else {
			if (caseInfo.numComments !== undefined && parseResult.comments.length !== caseInfo.numComments) {
				plogger(`Expected ${caseInfo.numComments} comments but got ${parseResult.comments.length}`);
			}
			validateTokenInGeneral(parseResult.root, plogger, ParseTreeTokenType);
			if (caseInfo.treeInfo !== undefined) {
				checkTreeInfo(parseResult.root, caseInfo.treeInfo, plogger, ParseTreeTokenType);
			}
			if (caseInfo.numTopChildren !== undefined && parseResult.root.children.length !== caseInfo.numTopChildren)
				plogger(`Expected ${caseInfo.numTopChildren} top children but got ${parseResult.root.children.length}`);
		}
	});
};