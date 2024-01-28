<?php
// Inclure config.php et initialiser la connexion à la base de données
//require_once 'includes/config.php';
require_once 'includes/db.php';
require_once 'class/Project.php';
require_once 'class/Skills.php';
require_once 'class/Blog.php';

session_start();
//bloquer l'accès à la page si l'utilisateur n'est pas connecté
if (!isset($_SESSION['email'])) {
    header("Location: admin-login.php");
    exit();
}



// Initialiser la classe Project pour gérer les opérations sur les projets
$projectManager = new Project($db);

// Initialiser la classe Blog pour gérer les opérations sur les blogs
$blogManager = new Blog($db);

// Initialiser la classe Skill pour gérer les opérations sur les compétences
$skillsManager = new Skills($db);




// Traiter les actions liées aux projets (ajout, modification, suppression)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['add_project'])) {
        // Traiter l'ajout de projet
        $projectName = htmlspecialchars($_POST['project_name'], ENT_QUOTES, 'UTF-8');
        $projectDescription = htmlspecialchars($_POST['project_description'], ENT_QUOTES, 'UTF-8');
        $projectManager->addProject($projectName, $projectDescription);
    } elseif (isset($_POST['edit_project'])) {
        // Traiter la modification de projet
        $pojectId = htmlspecialchars($_POST['project_id'], ENT_QUOTES, 'UTF-8');
        $newProjectName = htmlspecialchars($_POST['new_project_name'], ENT_QUOTES, 'UTF-8');
    } elseif (isset($_POST['delete_project'])) {
        // Traiter la suppression de projet
        $projectId = htmlspecialchars($_POST['project_id'], ENT_QUOTES, 'UTF-8');
        $projectManager->deleteProject($projectId);
    }
}

// Traiter les actions liées aux compétences (ajout, suppression)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['add_skills'])) {
        // Traiter l'ajout de compétence
        $skillsName = htmlspecialchars($_POST['skills_name'], ENT_QUOTES, 'UTF-8');
        $skillsManager->addSkills($skillsName);
    } elseif (isset($_POST['delete_skills'])) {
        // Traiter la suppression de compétence
        $skillsId = htmlspecialchars($_POST['skills_id'], ENT_QUOTES, 'UTF-8');
        $skillsManager->deleteSkills($skillsId);
    }
}

// Traiter les actions liées aux blogs (ajout, modification, suppression)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['add_blog'])) {
        // Traiter l'ajout de blog
        $blogTitle = htmlspecialchars($_POST['blog_title'], ENT_QUOTES, 'UTF-8');
        $blogContent = htmlspecialchars($_POST['blog_content'], ENT_QUOTES, 'UTF-8');
        $blogDate = $_POST['blog_date'];
        $blogManager->addBlog($blogTitle, $blogContent, $blogDate);
    } elseif (isset($_POST['edit_blog'])) {
        // Traiter la modification de blog
        $blogId = htmlspecialchars($_POST['blog_id'], ENT_QUOTES, 'UTF-8');
        $newBlogTitle = htmlspecialchars($_POST['new_blog_title'], ENT_QUOTES, 'UTF-8');
        $newBlogContent = htmlspecialchars($_POST['new_blog_content'], ENT_QUOTES, 'UTF-8');
        $blogManager->editBlog($blogId, $newBlogTitle, $newBlogContent);
    } elseif (isset($_POST['delete_blog'])) {
        // Traiter la suppression de blog
        $blogId = htmlspecialchars($_POST['blog_id'], ENT_QUOTES, 'UTF-8');
        $blogManager->deleteBlog($blogId);
    }
}





// Récupérer la liste des projets
$projects = $projectManager->getProjects();

// Récupérer la liste des compétences
$skills = $skillsManager->getSkills();

// Récupérer la liste des blogs
$blogs = $blogManager->getBlog();





?>

 <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/admin_dashboard.css">
    <title>Admin Dashboard</title>
    <?php include 'includes/header.php'; ?>
    

</head>

<body>
<h1>Tableau de bord</h1>
<button class="logout-button">
        <a href="logout.php">Déconnexion</a>
    </button>

    <div class="container">
    <!-- Formulaire d'ajout de projet -->
    <div class="add-project">
    <form action="admin_dashboard.php" method="post">
        <label for="project_name">Nom du projet:</label>
        <input type="text" name="project_name" required>
        <label for="project_description">Description du projet:</label>
        <input type="text" name="project_description" required>
        <button type="submit" name="add_project">Ajouter le projet</button>
    </form>
    </div>

    <!-- Liste des projets -->
    <div class="project-list">
    <ul>
        <?php foreach ($projects as $project) : ?>
            <li>
                <strong><?= $project['project_name']; ?></strong>
                - <?= $project['project_description']; ?>
                <!-- Formulaire de modification de projet -->
                <form action="admin_dashboard.php" method="post">
                    <input type="hidden" name="project_id" value="<?= $project['Id_project']; ?>">
                    <label for="new_project_name">Nouveau nom:</label>
                    <input type="text" name="new_project_name" required>
                    <label for="new_project_description">Nouvelle description:</label>
                    <input type="text" name="new_project_description" required>
                    <button type="submit" name="edit_project">Modifier le projet</button>
                </form>
                
                <!-- Formulaire de suppression de projet avec -->
                <form action="admin_dashboard.php" method="post" >
                    <input type="hidden" name="project_id" value="<?= $project['Id_project']; ?>">
                    <button type="submit" name="delete_project">Supprimer le projet</button>
                </form>
            </li>
        <?php endforeach; ?>
    </ul>
    </div>

    <!-- Formulaire d'ajout de compétence -->
    <div class="add-skills">
    <form action="admin_dashboard.php" method="post">
        <label for="skills_name">Nom de la compétence:</label>
        <input type="text" name="skills_name" required>
        <button type="submit" name="add_skills">Ajouter la compétence</button>
    </form>
    </div>

    <!-- Liste des compétences -->
    <div class="skills-list">
<ul>
    <?php foreach ($skills as $skill) : ?>
        <li>
            <strong><?= $skill['skills_name']; ?></strong>

            <!-- Formulaire de suppression de compétence avec confirmation -->
            <form action="admin_dashboard.php" method="post" onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?');">
                <input type="hidden" name="skills_id" value="<?= $skill['Id_skills']; ?>">
                <button type="submit" name="delete_skills">Supprimer la compétence</button>
            </form>
        </li>
    <?php endforeach; ?>
</ul>
</div>

  <!-- Formualaire d'ajout de blog -->
    <div class="add-blog">
    <form action="admin_dashboard.php" method="post">
            <label for="blog_title">Titre du blog:</label>
            <input type="text" name="blog_title" required>
            <label for="blog_content">Contenu du blog:</label>
            <input type="text" name="blog_content" required>
            <label for="blog_date">Date du blog:</label>
            <input type="date" name="blog_date" required>
            <button type="submit" name="add_blog">Ajouter le blog</button>
        </form>
    </div>
    
        <!-- Liste des blogs -->
        <div class="blog-list">
        <ul>
            <?php foreach ($blogs as $blog) : ?>
                <li>
                    <strong><?= $blog['blog_title']; ?></strong>
                    - <?= $blog['blog_content']; ?>
                    - <?= $blog['blog_date']; ?>
                    <!-- Formulaire de modification de blog -->
                    <form action="admin_dashboard.php" method="post">
                        <input type="hidden" name="blog_id" value="<?= $blog['Id_blog']; ?>">
                        <label for="new_blog_title">Nouveau titre:</label>
                        <input type="text" name="new_blog_title" required>
                        <label for="new_blog_content">Nouveau contenu:</label>
                        <input type="text" name="new_blog_content" required>
                        <button type="submit" name="edit_blog">Modifier le blog</button>
                    </form>
                    <!-- Formulaire de suppression de blog avec confirmation -->
                    <form action="admin_dashboard.php" method="post" onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer ce blog ?');">
                        <input type="hidden" name="blog_id" value="<?= $blog['Id_blog']; ?>">
                        <button type="submit" name="delete_blog">Supprimer le blog</button>
                    </form>
                </li>
            <?php endforeach; ?>
        </ul>
        </div>

    </div>


</body>

</html>  

