import { Command } from '../../Command.js';
import { MaybeDecided } from '../../../MaybeDecided.js';
await Command.asyncInit();

export function isLocalAssignmentToken(token, procedure, variable) {
	if (procedure === undefined)
		return MaybeDecided.No;
	const info = Command.getCommandInfo(token.val);
	if (info.primaryName === 'localmake' || info.primaryName === 'for')
		return MaybeDecided.Yes;
	const scopes = variable.getLocalScopesAt(token, procedure);
	if (scopes.length !== 0)
		return MaybeDecided.Yes;

	// Is there a case where localmake or a for-loop might be called before token?
	// Assume no for now.

	return MaybeDecided.No;
};