<?php

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
	http_response_code(405);
	?>HTTP method must be GET.<?php
	exit(1);
}

require_once('includes/db.php');
require_once('includes/utils.php');

deleteStaleContacts($pdoConn);

$sql = 'select username from contacts';
if (!isset($_GET['list_all']) || $_GET['list_all'] == '0') {
	$sql .= ' where chat_status is null'; 
	// filter out contacts that are already chatting with someone or invited someone to chat.
}

$statement = $pdoConn->query($sql);
$results = $statement->fetchAll(PDO::FETCH_ASSOC);
$json = json_encode($results);
header('Content-type: application/json');
echo $json;