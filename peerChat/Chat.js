class Chat extends UIMode {
	constructor(secret) {
		super(document.getElementById('chat'));
		this.secret = secret;
		this.peerChatConnection = new PeerChatConnection(this);
		this.chatPartnerUsername = document.getElementById('chat-partner-username');
		this.chatPartnerUsername2 = document.getElementById('chat-message-when-invitation-pending-username');
		this.conversationElement = document.getElementById('chat-conversation');
		this.textInputElement = document.getElementById('chat-text');
		this.noMessageElement = document.getElementById('chat-message-when-no-messages-yet');
		this.invitationPendingElement = document.getElementById('chat-message-when-invitation-pending');
		this.conversationMessagesElement = document.getElementById('chat-conversation-messages');
		this.messages = [];
		this.sendButton = document.getElementById('chat-send');
		var outer = this;
		this.sendButton.addEventListener('click', function() {
			outer._sendMessage();
		});
		// Keep the send button disabled unless there is some text to send.
		this.textInputElement.addEventListener('input', function() {
			var msg = outer.textInputElement.value.trim();
			outer.sendButton.disabled = (msg === '');
		});
		this.textInputElement.addEventListener('keyup', function(event) {
			if (event.key === 'Enter') {
				outer._sendMessage();
				outer.textInputElement.value = '';
			}
		});
		var chatClose = document.getElementById('chat-close');
		chatClose.addEventListener('click', function() {
			outer.close();
			outer.chatPartnerSelector.select();
		});
	}

	setChatPartnerSelector(chatPartnerSelector) {
		this.chatPartnerSelector = chatPartnerSelector;
		chatPartnerSelector.setChat(this);
	}

	invitationAccepted(partnerUsername) {
		this.peerChatConnection.invitationAccepted(partnerUsername);
		this.invitationPendingElement.classList.add('closed');
		this._updateConversationDisplay();
		this.show();
	}

	invitationSent(partnerUsername) {
		this.setPartnerUsername(partnerUsername, true);
		this.invitationPendingElement.classList.remove('closed');
		this.noMessageElement.classList.add('closed');
		this.show();
	}

	isWaitingForInvitationAcceptance() {
		return !this.invitationPendingElement.classList.contains('closed');
	}

	_sendMessage() {
		var msg = this.textInputElement.value.trim();
		if (msg !== '') {
			this.textInputElement.value = '';
			this.sendButton.disabled = true;
			this.messages.push({'msg': msg});
			this.peerChatConnection.sendMessage(msg);
			this._updateConversationDisplay();
		}
	}

	receivedMessage(msg) {
		this.messages.push({'msg': msg, 'from': this.partnerUsername});
	}

	_updateConversationDisplay() {
		this.conversationMessagesElement.innerHTML = '';
		if (this.messages.length === 0) {
			this.noMessageElement.classList.remove('closed');
		}
		else {
			this.noMessageElement.classList.add('closed');
		}
		
		var outer = this;
		this.messages.forEach(function(message) {
			var div = document.createElement('div');
			var usernameElement = document.createElement('div');
			usernameElement.classList.add('username');
			if (message.from === undefined) {
				usernameElement.classList.add('me');
				usernameElement.innerText = outer.username;
			}
			else {
				usernameElement.innerText = message.from;
			}
			div.appendChild(usernameElement);
			var messageDiv = document.createElement('div');
			messageDiv.classList.add('message');
			messageDiv.innerText = message.msg;
			div.appendChild(messageDiv);
			outer.conversationMessagesElement.appendChild(div);
		});
	}

	setUsername(username) {
		this.username = username;
	}

	setPartnerUsername(partnerUsername, isInvitingUser) {
		this.partnerUsername = partnerUsername;
		if (partnerUsername !== undefined) {
			this.chatPartnerUsername.innerText = partnerUsername;
			this.chatPartnerUsername2.innerText = partnerUsername;
			this._createPeerConnection(isInvitingUser);
		}
		this._resetMessages();
	}

	_resetMessages() {
		this.messages = [];
		this._updateConversationDisplay();
	}

	_createPeerConnection(isInvitingUser) {
		this.peerChatConnection.updateSDP(isInvitingUser);
	}
}