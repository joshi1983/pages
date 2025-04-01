import { ClickableName } from './ClickableName.js';
import { getProceduresMap } from
'../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { getSuggestions } from './getSuggestions.js';
import { LogoParser } from '../../../parsing/LogoParser.js';
import { ParseLogger } from '../../../parsing/loggers/ParseLogger.js';

/*
This is tied to Code and is therefore not very easy to unit test.
*/
export class TextareaSuggestionsUpdater {
	constructor(sContainer, textarea) {
		this.textarea = textarea;
		this.sContainer = sContainer;
	}

	update(position) {
		const code = this.textarea.value;
		// should we parse directly from source code?
		const parseLogger = new ParseLogger();
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (tree === undefined) {
			this.sContainer.hide();
			return; // can't do anything more when we can't parse.
		}
		const procedures = getProceduresMap(tree);
		const initialVariables = new Map();
		const suggestionsInfo = getSuggestions(procedures, tree, position, initialVariables);
		const token = suggestionsInfo.token;
		let typedIndex = suggestionsInfo.typedIndex;
		if (token !== undefined && (typeof token.val === 'string') && token.children.length === 0)
			typedIndex += token.toString().length - token.val.length;
		const clickableNames = suggestionsInfo.strings.map(s => new ClickableName(s, function() {
			console.log('clicked ');
		}, typedIndex));
		this.sContainer.setSuggestions(clickableNames);
		this.updatePosition(position);
	}

	updatePosition(position) {
		this.sContainer.setPosition(position);
	}
};