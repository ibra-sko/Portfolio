
<?php
/*

class Config
{
    private $dbHost;
    private $dbName;
    private $dbUser;
    private $dbPassword;
    private $siteUrl;

    public function __construct($dbHost, $dbName, $dbUser, $dbPassword, $siteUrl)
    {
        $this->dbHost = $dbHost;
        $this->dbName = $dbName;
        $this->dbUser = $dbUser;
        $this->dbPassword = $dbPassword;
        $this->siteUrl = $siteUrl;

        $this->initDatabase();
    }

    private function initDatabase()
    {
        try {
            // Créer une instance de la classe PDO (PHP Data Objects) pour la connexion à la base de données
            $db = new PDO("mysql:host=$this->dbHost;dbname=$this->dbName", $this->dbUser, $this->dbPassword);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Stocker l'instance PDO dans la variable globale $db
            $GLOBALS['db'] = $db;
        } catch (PDOException $e) {
            die("Erreur de connexion à la base de données : " . $e->getMessage());
        }
    }

    public function getSiteUrl()
    {
        return $this->siteUrl;
    }
}

// Utilisation de la classe pour configurer la base de données et autres paramètres globaux
$config = new Config('127.0.0.1', 'portfolio', 'root', '', 'http://localhost/portfolio');
$siteUrl = $config->getSiteUrl();

// Vous pouvez maintenant utiliser la connexion à la base de données avec $GLOBALS['db']
// et accéder à l'URL du site avec $siteUrl
/*
*/