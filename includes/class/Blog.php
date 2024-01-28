<?php

// Class Blog.php

class Blog
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function addBlog($blogTitle, $blogContent, $blogDate)
    {
        $query = "INSERT INTO blog (blog_title, blog_content, blog_date) VALUES (:blogTitle, :blogContent, :blogDate)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':blogTitle', $blogTitle);
        $stmt->bindParam(':blogContent', $blogContent);
        $stmt->bindParam(':blogDate', $blogDate);      
        $stmt->execute();
    }

    public function editBlog($blogId, $newBlogTitle, $newBlogContent,)
    {
        $query = "UPDATE blog SET blog_title = :newBlogTitle, blog_content = :newBlogContent WHERE Id_blog = :blogId";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':newBlogTitle', $newBlogTitle);
        $stmt->bindParam(':newBlogContent', $newBlogContent);
        $stmt->bindParam(':blogId', $blogId);
        $stmt->execute();
    }


    public function deleteBlog($blogId)
    {
        $query = "DELETE FROM blog WHERE Id_blog = :blogId";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':blogId', $blogId);
        $stmt->execute();
    }

    public function getBlog()
    {
        $query = "SELECT * FROM blog";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}