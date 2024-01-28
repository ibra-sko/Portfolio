<?php

// Inclure config.php et initialiser la connexion à la base de données
require_once './includes/db.php';
require_once './class/Blog.php';



// Initialiser la classe Blog pour gérer les opérations sur les blogs
$blogManager = new Blog($db);

// Récupérer la liste des blogs
$blogs = $blogManager->getBlog();

// Afficher la liste des blog
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/blog.css">
    <title>Blog</title>
</head>

<body>
    <?php include 'includes/header.php'; ?>

    <h1>Le Blog</h1>

    <!-- Liste des blogs -->
    <ul>
        <?php foreach ($blogs as $blog) : ?>
            <li>
                <div class="blog-card">
                    <h2 class="blog-title"><?= $blog['blog_title']; ?></h2>
                    <p class="blog-content"><?= $blog['blog_content']; ?></p>
                    <p class="blog-date"><?= $blog['blog_date']; ?></p>
                </div>
            </li>
        <?php endforeach; ?>
    </ul>
</body>

</html>
