<?php
// admin-login.php

// Inclure les fichiers requis
require_once './includes/db.php';

// Démarrer la session
session_start();


// Initialiser la classe Admin pour gérer la connexion à l'administration
class Admin
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function login($email, $password)
    {
        $query = $this->db->prepare('SELECT * FROM admins WHERE email = ?');
        $query->execute([$email]);
        $admin = $query->fetch(PDO::FETCH_ASSOC);
        

        if ($admin) {
            if ($password == $admin['password'] || password_verify($password, $admin['password'])) {
                $_SESSION['email'] = $email;
                return $admin;
            }

        }

    }


}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Traiter la connexion
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Initialiser la classe Admin pour gérer la connexion à l'administration
    $adminManager = new Admin($db);

    // Vérifier si l'administrateur existe et si le mot de passe est correct
    $admin = $adminManager->login($email, $password);

    if ($admin) {
        // L'administrateur existe et le mot de passe est correct
        // Enregistrer l'ID de l'administrateur dans la session
        $_SESSION['admin_id'] = $admin['id'];

        // Rediriger vers la page d'administration
        header("Location: /PORTFOLIO/admin_dashboard.php");
        exit();
    } else {
        // L'administrateur n'existe pas ou le mot de passe est incorrect
        $error_message = "L'adresse courriel ou le mot de passe est incorrect.";
    }
}

?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/login.css"> 
    <title>Connexion Administrateur</title>
    <?php include 'includes/header.php'; ?>
</head>
<body>

<div class="login-container">
    <h2>Connexion Administrateur</h2>
    
    <form method="post" >
        <label for="email">E-mail :</label>
        <input type="text" name="email" required>

        <label for="password">Mot de passe :</label>
        <input type="password" name="password" required>

        <button type="submit">Se connecter</button>
    </form>

    <!-- Afficher un message d'erreur s'il y a lieu -->
    <?php
    if (!empty($error_message)) {
        echo "<p class='error-message'>$error_message</p>";
    }
    ?>

</div>

</body>
</html>
