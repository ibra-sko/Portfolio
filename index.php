<?php
include 'includes/db.php';
include 'class/Skills.php';
include 'class/Project.php';



$skillsManager = new Skills($db);

$skills = $skillsManager->getSkills();

$projectManager = new Project($db);

$projects = $projectManager->getProjects();

?>

<!DOCTYPE html>
<html lang="fr">
<link rel="stylesheet" href="./css/index.css">
<head>
    <?php include './includes/header.php'; ?>
</head>
<body>

    <!-- Contenu spécifique à la page d'accueil -->
    <div class="container">
        <h1> Bienvenue sur mon Portfolio</h1>
        <p> Je m'appelle <strong>Ibrahim SAKO</strong> et je suis développeur web junior. </p>
        <p> Je suis actuellement en formation à <strong>YNOV</strong> à Sophia. </p>
        <p> N'hésitez pas à me contacter pour plus d'informations. </p>
    </div>
    <!-- Liste des compétences -->
<div class="container2">
        <h2> Compétences </h2>
        <?php foreach ($skills as $skill) : ?>
           
             <div class="card">
                <strong><?= $skill['skills_name']; ?></strong>
            </div>
        <?php endforeach; ?>
</div>
    <!-- Liste des projets -->
    <div class="container3">
        <h2> Projets </h2>
        <?php foreach ($projects as $project) : ?>
           
             <div class="card2">
                <strong><?= $project['project_name']; ?></strong>
                : <?= $project['project_description']; ?>
            </div>
        <?php endforeach; ?>
    </div>

    
        
</body>
</html>