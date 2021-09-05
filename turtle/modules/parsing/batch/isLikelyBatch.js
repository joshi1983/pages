import { matchesARegex } from '../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const antisignals = [
	// indicators of PHP
	/(^|[\r\n])[ \t]*<?php/i
];

const signals = [
	/(^|[\r\n])[ \t]*@echo[ \t]+(off|on)[\s&]/i,
	/(^|[\r\n])[ \t]*echo[ \t]+/i,
	/(^|[\r\n])[ \t]*exit[ \t]+\/[a-z]/i,
	/(^|[\r\n])[ \t]*for[ \t]+\/[dflr]\s/i,
	/(^|[\r\n])[ \t]*set[ \t]+\/a\s/i,
	/(^|[\r\n])[ \t]*goto[ \t]+:eof/i
];

export function isLikelyBatch(code) {
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	return false;
};