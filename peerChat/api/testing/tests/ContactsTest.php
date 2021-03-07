<?php
final class ContactsTest extends CustomTestCase
{
	private function getContactsForChat() {
		$response = $this->client->request('GET', 'contacts.php');
		$content = (string)$response->getBody();
		$responseData = json_decode($content, true);
		return $this->getUsernamesFromContacts($responseData);
	}

    public function testGetContacts(): void
    {
		$this->validateContacts();
    }

	public function testAddContact(): void
	{
		// try some incorrect HTTP methods.
		$response = $this->client->request('GET', 'addContact.php', ['http_errors' => false]);
		$this->assertEquals(405, $response->getStatusCode());
		$response = $this->client->request('PUT', 'addContact.php', ['http_errors' => false]);
		$this->assertEquals(405, $response->getStatusCode());
		$response = $this->client->request('POST', 'addContact.php', ['http_errors' => false]);
		$this->assertEquals(422, $response->getStatusCode());
		// add a contact.
		$secret = '182548bfw8bfw7tb8tewbgdfsy8nhwe89fh';
		$username = $this->getUniqueUsername();
		$response = $this->client->request('POST', 'addContact.php', ['http_errors' => false]);
		$this->assertEquals(422, $response->getStatusCode());
		$this->addContact($username, $secret);
		// Check that the newly added contact is in all contacts.
		$contacts = $this->getUsernamesFromContacts($this->validateContacts());
		$this->assertTrue(count($contacts) > 0); // the newly added contact must exist.
		$this->assertTrue(array_search($username, $contacts) !== false);

		// Check that the newly added contact is available for chat invitations.
		$contacts = $this->getContactsForChat();
		$this->assertTrue(count($contacts) > 0); // the newly added contact must exist.
		$this->assertTrue(array_search($username, $contacts) !== false);

		$response = $this->client->request('POST', 'addContact.php', [
			'http_errors' => false,
			'form_params' => [
				'secret' => $secret,
				'username' => $username
			]
		]);
		// block since username already exists.
		$this->assertEquals(403, $response->getStatusCode());
	}

	public function testPing(): void
	{
		$response = $this->client->request('GET', 'ping.php', ['http_errors' => false]);
		$this->assertEquals(405, $response->getStatusCode()); // wrong HTTP method
		$response = $this->client->request('POST', 'ping.php', ['http_errors' => false]);
		$this->assertEquals(422, $response->getStatusCode()); // missing parameters
		
		$secret = '182548bfw8bfw7tb8tewbgdfsy8nhwe89fh';
		$username = $this->getUniqueUsername();
		$this->addContact($username, $secret);
		$response = $this->ping($username, $secret);
		$this->assertEquals(200, $response->getStatusCode());
		$responseData = json_decode((string)$response->getBody(), true);
		$this->assertTrue(isset($responseData['invitations']));
		$this->assertTrue(is_array($responseData['invitations']));
		$this->assertTrue($responseData['chat_status'] === null);
	}
}