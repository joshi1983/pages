<?php

$logFilename = 'log.txt';
$logFP = fopen($logFilename, 'a');

function validatePostedUsernameAndSecret($additional_required_keys = []) {
	if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
		http_response_code(405);
		?>HTTP method must be POST.<?php
		exit(1);
	}
	$requiredKeys = array_merge(['username', 'secret'], $additional_required_keys);
	foreach ($requiredKeys as $key) {
		if (!isset($_POST[$key])) {
			http_response_code(422);
			echo $key;
			?> must be specified.<?php
			exit(2);
		}
	}
	if ($_POST['secret'] === 'undefined') {
		?>secret must not be undefined.<?php
		exit(3);
	}
}

function deleteStaleContacts($pdoConn) {
	$timeLimit = 2; // 2 seconds

	// disconnect stale contacts from chat connections they may have.
	$pdoConn->query('update contacts c 
	INNER JOIN contacts partner ON partner.username = c.chat_partner_username
	set c.chat_status=null, c.chat_partner_username=null
	where partner.lastPingTimeUtc < UTC_TIMESTAMP() - INTERVAL '.$timeLimit.' SECOND');

	$pdoConn->query('delete from contacts where lastPingTimeUtc < UTC_TIMESTAMP() - INTERVAL '.$timeLimit.' SECOND');
}

function checkUsernameAndSecret($pdoConn) {
	// update inviting record to set chat partner to null.
	// chat_status will go back to null.
	$statement = $pdoConn->prepare('select * from contacts where username=:username and secret=:secret');
	$statement->execute([
		'username' => $_POST['username'],
		'secret' => $_POST['secret']
	]);
	if ($statement->rowCount() === 0) {
		http_response_code(403);
		?>No record matches the specified username and secret.<?php
		exit(1);
	}
}

function logMessage($msg) {
	global $logFP;
	fprintf($logFP, "%s\r\n", $msg);
}