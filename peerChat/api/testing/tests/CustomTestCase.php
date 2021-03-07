<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

abstract class CustomTestCase extends TestCase {
	protected $client;

    protected function setUp(): void
    {
		$filename = 'settings.json';
		if (!file_exists($filename)) {
			echo 'Required file '. $filename.' not found.  See readme.md for how to create it.';
			exit(1);
		}
		$settings = json_decode(file_get_contents($filename), true);
		if ($settings === null) {
			echo 'Invalid JSON found in '.$filename.'. Unable to parse.';
			exit(2);
		}
		if (!isset($settings['base_uri'])) {
			echo 'Required base_uri not found in '.$filename;
			exit(3);
		}
		$base_uri = $settings['base_uri'];
        $this->client = new GuzzleHttp\Client([
            'base_uri' => $base_uri
        ]);
    }

	protected function validateContacts()
	{
		$response = $this->client->get('contacts.php?list_all=1');
		$this->assertEquals(200, $response->getStatusCode());
		$content = (string)$response->getBody();
		$responseData = json_decode($content, true);
		$this->assertTrue(is_array($responseData));
		foreach ($responseData as $contact) {
			$this->assertTrue(is_array($contact));
			$this->assertTrue(isset($contact['username']));
		}
		return $responseData;
	}

	protected function getUsernamesFromContacts($contacts)
	{
		return array_map(function($contact) {
			return $contact['username'];
		}, $contacts);
	}

	protected function getUniqueUsername() 
	{
		$username = 'test_';
		$existingContacts = $this->getUsernamesFromContacts($this->validateContacts());
		for ($i = 1; true; $i++) {
			if (array_search($username.$i, $existingContacts) === false) {
				return $username.$i;
			}
		}
	}

	protected function addContact($username, $secret)
	{
		$response = $this->client->request('POST', 'addContact.php', [
			'form_params' => [
				'secret' => $secret,
				'username' => $username
			]
		]);
		$this->assertEquals(200, $response->getStatusCode());
		$responseData = json_decode((string)$response->getBody(), true);
		$this->assertTrue(isset($responseData['msg']));
	}

	protected function ping($username, $secret)
	{
		return $this->client->request('POST', 'ping.php', [
			'http_errors' => false,
			'form_params' => [
				'username' => $username,
				'secret' => $secret
			]
		]);
	}
}