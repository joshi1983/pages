<?php
final class InvitationsTest extends CustomTestCase
{
	const sdp1 = 'v=0
o=- 5741781757818083658 2 IN IP4 127.0.0.1
s=-
t=0 0
a=extmap-allow-mixed
a=msid-semantic: WMS';
	const sdp2 = 'v=0
o=- 574178175781808123 2 IN IP4 127.0.0.1
s=-
t=0 0
a=extmap-allow-mixed
a=msid-semantic: WMS';

	private function setSDP($params) {
		return $this->client->request('POST', 'setSDP.php', [
			'http_errors' => false,
			'form_params' => $params
		]);
	}

	private function getPartnerSDP($username, $secret, $chat_partner_username, $expectedStatusCode = 200) {
		$response = $this->client->request('POST', 'getPartnerSDP.php', [
			'http_errors' => false,
			'form_params' => [
				'username' => $username,
				'secret' => $secret,
				'chat_partner_username' => $chat_partner_username
			]
		]);
		$content = (string)$response->getBody();
		$this->assertEquals($expectedStatusCode, $response->getStatusCode());
		if ($expectedStatusCode === 200) {
			$responseData = json_decode($content, true);
			$this->assertTrue(isset($responseData['sdp']));
		}
		return $response;
	}

	public function testSetSDP(): void
	{
		$secret = '182548bfw8bfw7tb8tewbgdfsy8nhwe89fh';
		$username = $this->getUniqueUsername();
		$this->addContact($username, $secret);
		$chat_partner_username = $this->getUniqueUsername();
		// attempt setting chat partner to the same username.
		$response = $this->setSDP(['username' => $username,
				'secret' => $secret,
				'sdp' => InvitationsTest::sdp1,
				'chat_partner_username' => $username]);
		$this->assertEquals(422, $response->getStatusCode());

		// pick a username that doesn't exist.
		$chat_partner_username = $this->getUniqueUsername();
		$response = $this->setSDP([
				'username' => $username,
				'secret' => $secret,
				'sdp' => InvitationsTest::sdp1,
				'chat_partner_username' => $chat_partner_username
			]);
		$this->assertEquals(404, $response->getStatusCode());
		
		$existingContacts = $this->getUsernamesFromContacts($this->validateContacts());
		if (count($existingContacts) < 1) {
			$chat_partner_username = $this->getUniqueUsername();
			$this->addContact($chat_partner_username, $secret);
		}
		else {
			foreach ($existingContacts as $existingContact) {
				if ($existingContact !== $username) {
					$chat_partner_username = $existingContact;
					break;
				}
			}
		}
		$response = $this->setSDP([
				'username' => $username,
				'secret' => $secret,
				'sdp' => InvitationsTest::sdp1,
				'chat_partner_username' => $chat_partner_username
			]);
		$this->assertEquals(200, $response->getStatusCode());
	}

	private function setupTwoUsersWithInvitation() {
		$secret = '182548bfw8bfw7tb8tewbgdfsy8nhwe89fh';
		$username1 = $this->getUniqueUsername();
		$this->addContact($username1, $secret);
		$username2 = $this->getUniqueUsername();
		$this->addContact($username2, $secret);
		
		// username1 invites username2 to chat.
		$response = $this->setSDP([
				'username' => $username1,
				'secret' => $secret,
				'sdp' => InvitationsTest::sdp1,
				'chat_partner_username' => $username2
			]);
		$this->assertEquals(200, $response->getStatusCode());
		// verify that username2 will receive the chat invitation.
		$response = $this->ping($username2, $secret);
		$this->assertEquals(200, $response->getStatusCode());
		$responseData = json_decode((string)$response->getBody(), true);
		$this->assertEquals(1, count($responseData['invitations']));
		$this->assertEquals(null, $responseData['chat_status']);
		$this->assertEquals(null, $responseData['chat_partner_username']);

		// verify that username1 does not have any invitations.
		$response = $this->ping($username1, $secret);
		$this->assertEquals(200, $response->getStatusCode());
		$responseData = json_decode((string)$response->getBody(), true);
		$this->assertEquals(0, count($responseData['invitations']));
		$this->assertEquals(1, $responseData['chat_status']);
		$this->assertEquals($username2, $responseData['chat_partner_username']);

		return [
			'secret' => $secret,
			'username1' => $username1,
			'username2' => $username2
		];
	}

	public function testDeclineInvitation(): void
	{
		$setupInfo = $this->setupTwoUsersWithInvitation();
		// username2 declines the invitation.
		$response = $this->client->request('POST', 'declineChatInvitation.php', [
			'http_errors' => false,
			'form_params' => [
				'username' => $setupInfo['username2'],
				'secret' => $setupInfo['secret'],
				'chat_partner_username' => $setupInfo['username1']
			]
		]);
		$this->assertEquals(200, $response->getStatusCode());
		// expect no invitations, chat_status of null for both username1 and username2.
		foreach (['username1', 'username2'] as $usernameKey) {
			$response = $this->ping($setupInfo[$usernameKey], $setupInfo['secret']);
			$this->assertEquals(200, $response->getStatusCode());
			$responseData = json_decode((string)$response->getBody(), true);
			$this->assertTrue(isset($responseData['invitations']));
			$this->assertTrue(is_array($responseData['invitations']));
			$this->assertEquals(0, count($responseData['invitations']));
			$this->assertEquals(null, $responseData['chat_status']);
			$this->assertEquals(null, $responseData['chat_partner_username']);
		}
	}

	public function testGetPartnerSDP(): void
	{
		$setupInfo = $this->setupTwoUsersWithInvitation();
		$response = $this->getPartnerSDP($setupInfo['username2'], $setupInfo['secret'], $setupInfo['username2'], 422);
		$response = $this->getPartnerSDP($setupInfo['username2'], $setupInfo['secret'], $setupInfo['username1'], 200);
		$response = $this->getPartnerSDP($setupInfo['username1'], $setupInfo['secret'], $setupInfo['username2'], 404);
	}

	public function testSimulatedChat(): void
	{
		$setupInfo = $this->setupTwoUsersWithInvitation();
		$response = $this->getPartnerSDP($setupInfo['username2'], $setupInfo['secret'], $setupInfo['username1']);

		// username2 accepts the invitation.
		$response = $this->setSDP([
				'username' => $setupInfo['username2'],
				'secret' => $setupInfo['secret'],
				'sdp' => InvitationsTest::sdp2,
				'chat_partner_username' => $setupInfo['username1']
			]);
		$this->assertEquals(200, $response->getStatusCode());

		// Verify that no chat invitation exists from the inviting user now that it was accepted.
		$response = $this->ping($setupInfo['username2'], $setupInfo['secret']);
		$this->assertEquals(200, $response->getStatusCode());
		$content = (string)$response->getBody();
		$responseData = json_decode($content, true);
		$this->assertEquals($setupInfo['username1'], $responseData['chat_partner_username']);
		$this->assertFalse(array_search($setupInfo['username1'], $responseData['invitations']));

		// chat_status should be 2.
		$this->assertEquals(2, $responseData['chat_status']);

		$this->assertEquals(0, count($responseData['invitations']));
		// expect no invitations.  We're already chatting.
		
		// username1 gets answer SDP from username2.
		$response = $this->getPartnerSDP($setupInfo['username1'], $setupInfo['secret'], $setupInfo['username2'], 200);

		// verify that no invitations are returned by username1.
		$response = $this->ping($setupInfo['username1'], $setupInfo['secret']);
		$this->assertEquals(200, $response->getStatusCode());
		$responseData = json_decode((string)$response->getBody(), true);
		$this->assertEquals(0, count($responseData['invitations']));
		$this->assertEquals(2, $responseData['chat_status']);

		// simulate leaving the chat room.
		$response = $this->client->request('POST', 'declineChatInvitation.php', [
			'http_errors' => false,
			'form_params' => [
				'username' => $setupInfo['username1'],
				'secret' => $setupInfo['secret'],
				'chat_partner_username' => $setupInfo['username2']
			]
		]);
		$this->assertEquals(200, $response->getStatusCode());

		// verify that the user is no longer chatting with anyone.
		$response = $this->ping($setupInfo['username1'], $setupInfo['secret']);
		$this->assertEquals(200, $response->getStatusCode());
		$responseData = json_decode((string)$response->getBody(), true);
		
		// no invitations are expected now.
		$this->assertTrue(is_array($responseData['invitations']));
		$this->assertEquals(0, count($responseData['invitations'])); // expect no invitations.

		$this->assertEquals(null, $responseData['chat_status']);
		$this->assertEquals(null, $responseData['chat_partner_username']);
	}
}