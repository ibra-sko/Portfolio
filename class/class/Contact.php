<?php

// Class Contact.php


class Contact
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function addContact($contactName, $contactTitre, $contactMessage, $contactDate)
    {
        $query = "INSERT INTO contact (contact_name, contact_titre, contact_message, contact_date) VALUES (:contactName, :contactTitre, :contactMessage, :contactDate)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':contactName', $contactName);
        $stmt->bindParam(':contactTitre', $contactTitre);
        $stmt->bindParam(':contactMessage', $contactMessage);
        $stmt->bindParam(':contactDate', $contactDate);
        $stmt->execute();
    }

   

}


