<?php

// Class Skills.php

class Skills
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function addskills ($skillsName)
    {
        $query = "INSERT INTO skills (skills_name) VALUES (:skillsName)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':skillsName', $skillsName);
        $stmt->execute();
    }
    
    public function deleteSkills($skillsId)
    {
        $query = "DELETE FROM skills WHERE Id_skills = :skillsId";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':skillsId', $skillsId);
        $stmt->execute();
    }


    public function getSkills()
    {
        $query = "SELECT * FROM skills";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}