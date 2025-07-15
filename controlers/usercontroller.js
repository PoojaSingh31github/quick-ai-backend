import sql from "../db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const creations =
      await sql`SELECT * FROM creation WHERE user_id = ${userId} ORDER BY created_at DESC`;
    return res.json({ success: true, creations });
  } catch (error) {
    console.error("Error fetching user creations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    const creations =
      await sql`SELECT * FROM creation WHERE publish = true ORDER BY created_at DESC`;
    return res.json({ success: true, creations });
  } catch (error) {
    console.error("Error fetching published creations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { creationId } = req.body;
    if (!creationId) {
      return res.status(400).json({ message: "Creation ID is required" });
    }
    const [creation] = await sql`SELECT * FROM creation WHERE id = ${creationId}`;

    if (!creation) {
      return res.status(404).json({ message: "Creation not found" });
    }

    // Check if the user has already liked this creation
    const currentLikes = creation.likes;
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      // User has already liked this creation, so we remove their like
      updatedLikes = currentLikes.filter((id) => id !== userIdStr);
      message = "Creation unliked successfully";
    } else {
      // User has not liked this creation, so we add their like
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation liked successfully";
    }
    // Update the creation with the new likes array
    const formattedArray = `{${updatedLikes.join(",")}}`;
    await sql`UPDATE creation SET likes = ${formattedArray}::text[] WHERE id = ${creationId}`;
    return res.json({ success: true, message, likes: updatedLikes.length });
  } catch (error) {
    console.error("Error toggling creation like:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
