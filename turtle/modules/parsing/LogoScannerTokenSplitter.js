import { Token } from './Token.js';
import { fetchJson } from '../fetchJson.js';
import { findLongestMatch, isNumeric, signedNumberRegEx } from './scanning/Numbers.js';
let operatorsData;
let operatorSymbolsArray;
let operatorSymbols;

async function asyncInit() {
	operatorsData = await fetchJson('json/operators.json');
	operatorSymbolsArray = operatorsData.map((od) => od.symbol);
	operatorSymbolsArray.push('!='); // helps with autofixing != to <>.
	operatorSymbols = new Set(operatorSymbolsArray);
	// sort from longest to shortest operators.
	operatorSymbolsArray.sort((s1, s2) => s2.length - s1.length);
}
// The use of promises instead of await to resolve the promise before
// the module can be imported is to allow web workers to import this module.
const initPromise = asyncInit();

function shouldCharSplitNumberFromToken(c) {
	return c !== '.' && c.toLowerCase() === c.toUpperCase();
}

export class LogoScannerTokenSplitter {
	static asyncInit() {
		return initPromise;
	}

	static splitSingleTokenAroundQuotes(token) {
		if (token.s.lastIndexOf('"') < 1 || token.s.charAt(0) === '\'')
			return [token];

		const resultTokens = [];
		let tok = new Token('', 0, token.lineIndex);
		for (let i = 0; i < token.s.length; i++) {
			const c = token.s.charAt(i);
			if (c === '"') {
				if (tok.s.length !== 0) {
					tok.colIndex = token.colIndex - (token.s.length - i);
					resultTokens.push(tok);
				}
				tok = new Token('"', 0, token.lineIndex);
			}
			else
				tok.s += c;
		}
		if (tok.s !== '' && tok.s !== '"') {
			tok.colIndex = token.colIndex;
			resultTokens.push(tok);
		}
		return resultTokens;
	}

	static splitSingleTokenAroundOperators(token) {
		// Never split operators that are exactly matching the whole token.
		// Never split comment tokens.
		const firstChar = token.s.charAt(0);
		if (operatorSymbols.has(token.s) || firstChar === ';' || firstChar === '"' || firstChar === '\'')
			return [token];
		if (token.s.lastIndexOf('"') >= 1)
			return LogoScannerTokenSplitter.splitTokensAroundOperators(LogoScannerTokenSplitter.splitSingleTokenAroundQuotes(token));
		if (signedNumberRegEx.test(token.s)) {
			const number = findLongestMatch(token.s);
			if (number.length === token.s.length)
				return [token];
			else if (shouldCharSplitNumberFromToken(token.s.charAt(number.length))) {
				const numberToken = new Token(number, token.colIndex - token.s.length + number.length, token.lineIndex);
				const remainingToken = new Token(token.s.substring(number.length), token.colIndex, token.lineIndex);
				return [numberToken].concat(LogoScannerTokenSplitter.splitSingleTokenAroundOperators(remainingToken));
			}
		}
		if (token.s.length >= 2 && (token.s[0]==='+' || token.s[0]==='-') &&
		signedNumberRegEx.test(token.s.substring(1))) {
			// get the first token.
			const result = [new Token(token.s[0], token.colIndex - token.s.length + 1, token.lineIndex)];
			// use recursion to split the rest.
			const remainingTokens = LogoScannerTokenSplitter.splitSingleTokenAroundOperators(new Token(token.s.substring(1), token.colIndex, token.lineIndex));
			return result.concat(remainingTokens);
		}
		const result = [];
		for (let symbol of operatorSymbolsArray) {
			const index = token.s.indexOf(symbol);
			if (index !== -1) {
				if (index > 0) {
					// Add a token to represent the substring before the found symbol.
					const colIndex = token.colIndex - token.s.length + index;
					
					result.push(new Token(token.s.substring(0, index), colIndex, token.lineIndex));
					
				}
				result.push(new Token(symbol, token.colIndex - token.s.length + symbol.length + index, token.lineIndex));
				if (index + symbol.length < token.s.length)
					result.push(new Token(token.s.substring(index + symbol.length), token.colIndex, token.lineIndex));
				if (symbol.length === 1)
					return result;
				else
					return LogoScannerTokenSplitter.splitTokensAroundOperators(result);
					// use indirect recursion to make sure all other symbols are split.
			}
		}
		return [token];
	}

	static splitTokensAroundOperators(tokens) {
		const result = [];
		tokens.forEach(function(token) {
			const subtokens = LogoScannerTokenSplitter.splitSingleTokenAroundOperators(token);
			subtokens.forEach(function(token) {
				result.push(token);
			});
		});
		return result;
	}

	static sanitizeTokens(tokens) {
		if (tokens.length === 0)
			return tokens;
		const result = [tokens[0]];
		for (let i = 1; i < tokens.length; i++) {
			const tok = tokens[i];
			const previousTok = tokens[i-1];
			if (tok.s.length > 1 &&
			previousTok.colIndex === tok.colIndex - tok.s.length &&
			previousTok.lineIndex === tok.lineIndex &&
			'+-'.indexOf(tok.s[0]) !== -1 && isNumeric(previousTok.s)) {
				result.push(new Token(tok.s[0], tok.colIndex - tok.s.length + 1, tok.lineIndex));
				result.push(new Token(tok.s.substring(1), tok.colIndex, tok.lineIndex));
			}
			else
				result.push(tok);
		}
		return result;
	}
}