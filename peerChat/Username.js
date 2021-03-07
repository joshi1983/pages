class Username extends UIMode {
	constructor(secret, chatInvitation) {
		super(document.getElementById('username-prompt'));
		this.secret = secret;
		this.username = undefined;
		this.chatInvitation = chatInvitation;
		this.usernameSpan = document.getElementById('username');
		this.usernameText = document.getElementById('username-prompt-username');
		this.usernameOk = document.getElementById('username-prompt-ok');
	}

	setChat(chat) {
		this.chat = chat;
	}

	setChatPartnerSelector(chatPartnerSelector) {
		this.chatPartnerSelector = chatPartnerSelector;
	}

	setChatInvitation(chatInvitation) {
		this.chatInvitation = chatInvitation;
	}

	reset() {
		if (this.pingInterval) {
			clearInterval(this.pingInterval);
			this.pingInterval = undefined;
		}
		this.chatInvitation.setInvitations([]);
		this.username = undefined;
		this.usernameSpan.innerText = '';
		this.show();
		var outer = this;
		this.getUsernameFromUser().then(function() {
			outer.chat.setUsername(outer.get());
			outer.chatInvitation.setUsername(outer.get());
		});
	}

	_set(newUsername) {
		this.username = newUsername;
		this.usernameSpan.innerText = this.username;
	}

	_getFetchConfig(username) {
		if (username === undefined)
			username = this.username;

		var form = new FormData();
		form.append('username', username);
		form.append('secret', this.secret);
		var config = {
			'method': 'POST',
			'body': form
		};
		return config;
	}

	_startPinging() {
		var outer = this;

		function sendPing() {
			var config = outer._getFetchConfig();
			fetch(serverUrl + 'ping.php', config).then(function(response) {
				if (response.status === 403) {
					outer.reset();
					return undefined;
				}
				return response.json();
			}).then(function(responseData) {
				if (responseData !== undefined) {
					outer.chatInvitation.setInvitations(responseData.invitations);
					if (outer.chat.isOpen()) {
						if (!responseData.chat_partner_username) {
							outer.chat.setPartnerUsername(undefined);
							outer.chat.close();
							outer.chatPartnerSelector.show();
						}
						else if (outer.chat.isWaitingForInvitationAcceptance() && responseData.chat_status === 2) {
							outer.chat.invitationAccepted(responseData.chat_partner_username);
						}
					}
				}
			});
		}
		sendPing();
		// avoid setting interval more than once.
		if (this.pingInterval === undefined)
			this.pingInterval = setInterval(sendPing, 1 * 1000);
	}

	getUsernameFromUser() {
		var outer = this;
		return new Promise(function(resolver, rejecter) {
			function clicked() {
				var sanitizedUsername = outer.usernameText.value.trim();
				if (sanitizedUsername.length < 2) {
					showTemporaryMessage('Username must be at least 2 characters', 'username-temporary-message');
				}
				else {
					var config = outer._getFetchConfig(sanitizedUsername);
					fetch(serverUrl + 'addContact.php', config).then(function(response) {
						if (response.status < 400) {
							outer._set(sanitizedUsername);
							outer._startPinging();
							outer.chatPartnerSelector.show();
							outer.chatPartnerSelector.select(outer.username);
							resolver();
						}
						else {
							response.text().then(function(result) {
								showTemporaryMessage(JSON.parse(result).msg, 'username-temporary-message');
							});
						}
					});
				}
			}

			outer.usernameOk.addEventListener('click', clicked);
			outer.usernameText.addEventListener('keyup', function(event) {
				if (event.key === 'Enter') {
					clicked();
				}
			});
		});
	}

	get() {
		return this.username;
	}
}