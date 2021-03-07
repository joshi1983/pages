class ChatInvitation extends UIMode {
	constructor(secret, chat) {
		super(document.getElementById('chat-invitation'));
		if (typeof secret !== 'string')
			throw new Error('secret must be a string.');
		if (typeof chat !== 'object')
			throw new Error('chat must be an object.');
		this.secret = secret;
		this.chat = chat;
		this.invitations = [];
		this.chatInvitationMessages = document.getElementById('chat-invitation-messages');
		this.chatInvitationBackdrop = document.getElementById('chat-invitation-backdrop');
	}

	setChatPartnerSelector(chatPartnerSelector) {
		this.chatPartnerSelector = chatPartnerSelector;
	}

	setUsername(newUsername) {
		this.username = newUsername;
	}

	_removeInvitation(inviterUsername) {
		this.invitations = this.invitations.filter(function(_inviterUsername) {
			return _inviterUsername !== inviterUsername;
		});
	}

	_invitationAccepted(inviterUsername) {
		this._removeInvitation(inviterUsername);
		this.chatPartnerSelector.close();
		this.chat.invitationAccepted(inviterUsername);
	}

	_invitationRejected(inviterUsername) {
		var form = new FormData();
		form.append('username', this.username);
		form.append('secret', this.secret);
		form.append('chat_partner_username', inviterUsername);
		var config = {
			'method': 'POST',
			'body': form
		};
		fetch(serverUrl + 'declineChatInvitation.php', config);
		this._removeInvitation(inviterUsername);
	}

	_updateInvitationsDisplay() {
		this.chatInvitationMessages.innerHTML = '';
		if (this.invitations.length === 0) {
			this.e.classList.add('closed');
		}
		else {
			this.e.classList.remove('closed');
		}
		var outer = this;
		this.invitations.forEach(function(inviterUsername) {
			var div = document.createElement('div');
			var usernameElement = document.createElement('strong');
			usernameElement.innerText = inviterUsername;
			var wantsMessageSpan = document.createElement('span');
			wantsMessageSpan.innerText = ' wants to chat.';
			var acceptButton = document.createElement('button');
			acceptButton.innerText = 'Accept';
			acceptButton.classList.add('accept');
			acceptButton.addEventListener('click', function() {
				outer._invitationAccepted(inviterUsername);
			});
			var rejectButton = document.createElement('button');
			rejectButton.innerText = 'Reject';
			rejectButton.classList.add('reject');
			rejectButton.addEventListener('click', function() {
				outer._invitationRejected(inviterUsername);
			});
			div.appendChild(usernameElement);
			div.appendChild(wantsMessageSpan);
			div.appendChild(acceptButton);
			div.appendChild(rejectButton);
			outer.chatInvitationMessages.appendChild(div);
		});
	}

	setInvitations(invitationUsernames) {
		if (!(invitationUsernames instanceof Array))
			throw new Error('invitationUsernames must be an Array.');
		if (invitationUsernames.length > 0 && typeof invitationUsernames[0] !== 'string')
			throw new Error('invitationUsernames must be an Array of string.');
		invitationUsernames = invitationUsernames.slice(0);
		invitationUsernames.sort();
		this.invitations = invitationUsernames;
		this._updateInvitationsDisplay();
	}
}