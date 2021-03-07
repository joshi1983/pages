<?php
/*
db.php performs a lot of checks and setup to make deployment 
in a new hosting environment as smooth as possible.
If any problem is found, we try to give a clear message 
explaining the problem and how to fix it.

This includes several validation checks, 
automatic creation of the database, 
and creation of the required tables.
*/

// Perform a few checks on db_config.php to help people 
// set it up properly.
if (!file_exists('includes/db_config.php')) {
	?>The db_config.php file must exist.  Create it.<?php
	exit(1);
}
require_once('db_config.php');
if (!isset($dbConfig)) {
	?>The db_config.php file must define $dbConfig.  It must be an array.<?php
	exit(2);
}
if (!is_array($dbConfig)) {
	?>$dbConfig from db_config.php must be an array.<?php
	exit(3);
}
$requiredKeys = ['hostname', 'dbName', 'username', 'password'];
foreach ($requiredKeys as $key) {
	if (!isset($dbConfig[$key])) {
		echo 'Key '.$key.' must be set in $dbConfig.';
		exit(4);
	}
}
// Verify a few things about the PHP environment to help
// people troubleshoot potential problems in their own hosting environment.
if ( !extension_loaded('pdo') ) {
	?>The pdo extension must be enabled.<?php
	exit(5);
}
if ( !extension_loaded('pdo_mysql') ) {
	?>PDO is enabled but the MySQL driver for PDO is not.  pdo_mysql is required.<?php
	exit(6);
}
$pdoConn = new pdo("mysql:host=".$dbConfig['hostname'], 
	$dbConfig['username'], $dbConfig['password'], 
	array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

$stmt = $pdoConn->query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '".$dbConfig['dbName']."'");
// if the configured database doesn't exist, create it.
if (!$stmt->fetchColumn()) {
	try {
		$pdoConn->exec('CREATE DATABASE `'.$dbConfig['dbName']."`;
                CREATE USER '".$dbConfig['username']."'@'localhost' IDENTIFIED BY '".$dbConfig['password']."';
                GRANT ALL ON `".$dbConfig['dbName']."`.* TO '".$dbConfig['username']."'@'localhost';
                FLUSH PRIVILEGES;")
        or die(print_r($dbh->errorInfo(), true));
		
    }
    catch (PDOException $e) {
        die("DB ERROR: " . $e->getMessage());
    }
}
$pdoConn->query("use ".$dbConfig['dbName']);

function tableExists($id)
{
	global $pdoConn;
    $results = $pdoConn->query("SHOW TABLES LIKE '$id'");
    if(!$results) {
        die(print_r($dbh->errorInfo(), TRUE));
    }
    return ($results->rowCount()>0);
}

// if contacts table doesn't exist, create it.
if (!tableExists('contacts')) {
	$pdoConn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
	$result = $pdoConn->query("create table contacts (
		id int primary key auto_increment,
		username varchar(50) not null unique,
		secret varchar(100) not null,
		sdp varchar(4000),
		chat_partner_username varchar(50),
		chat_status int,
		lastPingTimeUtc datetime not null,
		FOREIGN KEY (chat_partner_username)
			REFERENCES contacts(username)
			ON DELETE SET NULL
	) ENGINE=InnoDB");
	if ($result === false) {
		
	}
}