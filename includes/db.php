
 <?php
/*
$host = "127.0.0.1";
$username = "root";
$password = "";
$database = "portfolio";

try {
    // Créer une instance de la classe PDO (PHP Data Objects) pour la connexion à la base de données
    $db = new PDO("mysql:host=$host;dbname=$database", $username, $password);

    // Configurer PDO pour générer des exceptions en cas d'erreur SQL
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // En cas d'erreur de connexion, afficher un message d'erreur
    die("Erreur de connexion à la base de données: " . $e->getMessage());
}

<?php
*/
class Database
{
    private $host;
    private $username;
    private $password;
    private $database;
    private $connection;

    public function __construct($host, $username, $password, $database)
    {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->database = $database;

        $this->connect();
    }

    private function connect()
    {
        try {
            // Créer une instance de la classe PDO (PHP Data Objects) pour la connexion à la base de données
            $this->connection = new PDO("mysql:host=$this->host;dbname=$this->database", $this->username, $this->password);

            // Configurer PDO pour générer des exceptions en cas d'erreur SQL
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            // En cas d'erreur de connexion, afficher un message d'erreur
            die("Erreur de connexion à la base de données: " . $e->getMessage());
        }
    }

    public function getConnection()
    {
        return $this->connection;
    }
}

// Utilisation de la classe pour se connecter à la base de données
$database = new Database("127.0.0.1", "root", "", "portfolio");
$db = $database->getConnection();

// Vous pouvez maintenant utiliser $db pour effectuer des opérations sur la base de données

