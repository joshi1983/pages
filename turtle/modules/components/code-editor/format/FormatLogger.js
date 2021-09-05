import { breakLine } from './breakLine.js';
import { isAfterOrSame } from '../../../parsing/isAfterOrSame.js';
import { LoggedSection } from './LoggedSection.js';
import { ParseTreeToken } from '../../../parsing/ParseTreeToken.js';

export class FormatLogger {
	constructor(scannedTokens) {
		if (!(scannedTokens instanceof Array))
			throw new Error('scannedTokens must be an Array');
		if (scannedTokens.length !== 0 && scannedTokens[0] instanceof ParseTreeToken)
			throw new Error('scannedTokens should contain instances of Token(created from LogoScanner.scan).  Not ParseTreeToken.');

		this.scannedTokens = scannedTokens.filter(t => t.isComment());
		this.scanIndex = 0;
		this.indentation = 0;
		this.loggedSections = [];
		this.lines = [];
		this._removeSpacePrefixForNextLog = false;
	}

	blankLine() {
		this.newLine();
		if (this.lines.length === 0 || this.lines[this.lines.length - 1] !== '') {
			this.lines.push('');
		}
	}

	clearIndentation() {
		this.indentation = 0;
	}

	deindent() {
		this.indentation = Math.max(0, this.indentation - 1);
	}

	getNextLines() {
		return breakLine(this.indentation, this.loggedSections);
	}

	getString() {
		let s = '';
		for (let i = this.scanIndex; i < this.scannedTokens.length; i++) {
			const token = this.scannedTokens[i];
			s += token.s + '\n';
		}
		let result = this.lines.join('\n');
		if (this.loggedSections.length !== 0) {
			this.getNextLines().forEach(function(line) {
				result += '\n' + line;
			});
		}
		if (s !== '')
			s = '\n' + s;
		return (result + s).trim();
	}

	indent() {
		this.indentation ++;
	}

	log(s, parseToken) {
		if (!(parseToken instanceof ParseTreeToken))
			throw new Error('parseToken must be a ParseTreeToken');
		const originalScanIndex = this.scanIndex;
		for (let i = this.scanIndex; i < this.scannedTokens.length; i++) {
			const token = this.scannedTokens[i];
			this.scanIndex = i;
			if (isAfterOrSame(token, parseToken)) {
				if (originalScanIndex !== i) {
					this.newLine();
				}
				break;
			}
			this.newLine();
			this.loggedSections.push(new LoggedSection(token.s.trim(), ParseTreeToken.createFromScannedToken(token, new Set()), false));
			this.newLine();
			this.scanIndex = i + 1;
		}
		this.loggedSections.push(new LoggedSection(s, parseToken, !this._removeSpacePrefixForNextLog));
		this._removeSpacePrefixForNextLog = false;
	}

	newLine() {
		if (this.loggedSections.length !== 0) {
			const outer = this;
			this.getNextLines().forEach(function(line) {
				outer.lines.push(line);
			});
			this.loggedSections = [];
		}
	}

	removeSpacePrefixForNextLog() {
		this._removeSpacePrefixForNextLog = true;
	}
};