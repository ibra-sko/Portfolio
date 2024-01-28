<?php
// Inclure config.php et initialiser la connexion à la base de données
include './includes/db.php';
include './class/Contact.php';


// Initialiser la classe Contact pour gérer les opérations de contact
$contactManager = new Contact($db);

// Générer et stocker le jeton CSRF lors de l'affichage du formulaire
$csrf_token = bin2hex(random_bytes(32));
$_SESSION['csrf_token'] = $csrf_token;

// Traiter les actions liées au contact (ajout)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    {
        // Traiter l'ajout de contact
        $contactName = htmlspecialchars($_POST['contact_name'], ENT_QUOTES, 'UTF-8');
        $contactTitre = htmlspecialchars($_POST['contact_titre'], ENT_QUOTES, 'UTF-8');
        $contactMessage = htmlspecialchars($_POST['contact_message'], ENT_QUOTES, 'UTF-8');        
        $contactDate = $_POST['contact_date'];
        $contactManager->addContact($contactName, $contactTitre, $contactMessage, $contactDate);
    } 
    
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/contact.css">
    <title>Contactez-moi</title>
    <?php include 'includes/header.php'; ?>
</head>
<body>

    <!-- Formulaire de contact -->
    <div class="contact-container">
        <h2>Contactez-moi</h2>
        <form method="post" action="contact.php">
            <!-- Inclusion du jeton CSRF dans le formulaire -->
            <input type="hidden" name="csrf_token" value="<?= $csrf_token ?>">

            <label for="contact_name">Nom</label>
            <input type="text" name="contact_name" id="contact_name" required>
            <label for="contact_titre">Titre</label>
            <input type="text" name="contact_titre" id="contact_titre" required>
            <label for="contact_message">Message</label>
            <textarea name="contact_message" id="contact_message" cols="30" rows="10" required></textarea>
            <input type="hidden" name="contact_date" value="<?= date('Y-m-d H:i:s'); ?>">
            <input type="submit" name="add_contact" value="Envoyer">
        </form>
    </div>
</body>
</html>
