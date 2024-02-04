<?php

// Class Project.php
class Project
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function addProject($projectName, $projectDescription)
    {
        $query = "INSERT INTO projects (project_name, project_description) VALUES (:projectName, :projectDescription)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':projectName', $projectName);
        $stmt->bindParam(':projectDescription', $projectDescription);      
        $stmt->execute();
    }

    public function editProject($projectId, $newProjectName, $newProjectDescription,)
    {
        $query = "UPDATE projects SET project_name = :newProjectName, project_description = :newProjectDescription WHERE Id_project = :projectId";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':newProjectName', $newProjectName);
        $stmt->bindParam(':newProjectDescription', $newProjectDescription);
        $stmt->bindParam(':projectId', $projectId);
        $stmt->execute();
    }


    public function deleteProject($projectId)
    {
        $query = "DELETE FROM projects WHERE Id_project = :projectId";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':projectId', $projectId);
        $stmt->execute();
    }

    public function getProjects()
    {
        $query = "SELECT * FROM projects";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    

}
