import { LogoScannerTokenSplitter } from './LogoScannerTokenSplitter.js';
import { findLongestMatch, isNumeric } from './scanning/Numbers.js';
import { isNumberPossiblyExpected } from './scanning/isNumberPossiblyExpected.js';
import { isStartOfNumber } from './scanning/isStartOfNumber.js';
import { isStartingENumber } from './scanning/isStartingENumber.js';
import { isStartingStringLiteral } from './scanning/isStartingStringLiteral.js';
import { Token } from './Token.js';

export class LogoScanner {
	static asyncInit() {
		return LogoScannerTokenSplitter.asyncInit();
	}

	static scan(text, options) {
		if (options === undefined) {
			options = {'isSplittingNumberPrefixes': true};
		}
		const tokens = [];
		let token = '';
		let lineIndex = 0;
		let colIndex = 0;
		function pushToken(c) {
			if (!token.startsWith(';') && !token.startsWith("'"))
				token = token.trim();
			if (token !== '') {
				const cIndex = c === undefined ? colIndex : colIndex - 1;
				tokens.push(new Token(token, cIndex, lineIndex));
			}
			if (c !== undefined)
				tokens.push(new Token(c, colIndex, lineIndex));
			token = '';
		}
		for (let i = 0; i < text.length; i++) {
			let c = text.charAt(i);
			if (c === '\n') {
				pushToken('\n');
				lineIndex++;
				colIndex = 0;
				continue; // skip the colIndex++.
			}
			else if (c === ';') { // single-line comment
				colIndex--;
				pushToken();
				for (;i < text.length; i++) {
					c = text.charAt(i);
					if (c !== '\n') {
						token += c;
					}
					else {
						pushToken();
						colIndex++;
						pushToken('\n');
						lineIndex++;
						colIndex = -1;
						break;
					}
					colIndex++;
				}
				if (i === text.length)
					pushToken();
			}
			else if (c === '\'') { // long string literal
				colIndex--;
				pushToken();
				for (;i < text.length; i++) {
					c = text.charAt(i);
					if (c !== '\'' || token === '') {
						token += c;
					}
					else {
						token += '\'';
						colIndex++;
						pushToken();
						break;
					}
					if (c === '\n') {
						lineIndex++;
						colIndex = -1;
					}
					else
						colIndex++;
				}
				colIndex = Math.max(0, colIndex);
				if (i === text.length)
					pushToken();
			}
			else if ('[]()*/%'.indexOf(c) !== -1)
				pushToken(c);
			else if ('+-'.indexOf(c) !== -1 &&
			token === '' && findLongestMatch(text.substring(i)).length > 1) {
				const num = findLongestMatch(text.substring(i));
				colIndex += num.length - 1;
				pushToken(num);
				i += num.length - 1;
			}
			else if ('+-'.indexOf(c) !== -1 && token.charAt(0) !== '"' && !isStartingENumber(token) && (
			token !== '' ||
			(tokens.length > 0 && !tokens[tokens.length - 1].isCommandName()))
			) {
				pushToken(c);
			}
			else if (c === ':' && !isStartingStringLiteral(token)) {
				colIndex--;
				pushToken();
				colIndex++;
				token = c;
			}
			else if (options.isSplittingNumberPrefixes && c.toLowerCase() !== 'h' &&
			c !== '.' && isNumberPossiblyExpected(tokens) &&
			isStartOfNumber(token) && !isStartOfNumber(token + c)) {
				const lastChar = token[token.length - 1];
				if (lastChar.toLowerCase() === 'e') {
					token = token.substring(0, token.length - 1);
					colIndex -= 2;
					pushToken();
					token = lastChar + c;
					colIndex += 2;
				}
				else {
					colIndex--;
					pushToken();
					colIndex++;
					token = c;
				}
			}
			else if (/\s/g.test(c)) {
				colIndex--;
				pushToken();
				colIndex++;
			}
			else
				token += c;
			colIndex++;
		}
		colIndex--;
		pushToken();

		return LogoScannerTokenSplitter.sanitizeTokens(LogoScannerTokenSplitter.splitTokensAroundOperators(tokens));
	}

	static getTokensForParsing(text, options) {
		var tokens;
		if (typeof text === 'string')
			tokens = LogoScanner.scan(text, options);
		else if (!(text instanceof Array))
			throw new Error(`string or Array of Token required.  Not: ${text}`);
		else
			tokens = text;

		// we can ignore comments when making the parse tree.
		tokens = tokens.filter(function(token) {
			return !token.isComment();
		});
		// ignore NEW_LINE immediately after a "~" token.
		tokens = tokens.filter(function(token, index) {
			if (index !== 0 && token.s === '\n' && tokens[index - 1].s === '~')
				return false;
			if (index < tokens.length - 1 && token.s === '~' && tokens[index + 1].s === '\n')
				return false;
			return true;
		});
		return tokens;
	}
}