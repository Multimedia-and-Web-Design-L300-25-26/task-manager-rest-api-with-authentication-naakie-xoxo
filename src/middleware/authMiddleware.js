import jwt from "jsonwebtoken";
import User from "../models/User.js";


// 1. Extract token from Authorization header
// 2. Verify token
// 3. Find user
// 4. Attach user to req.user
// 5. Call next()
// 6. If invalid → return 401

const authMiddleware = async (req, res, next) => {
  try {
    // Extract the "Authorization" header in the request
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    } 
    const token = authHeader.replace("Bearer ", "");

    // Verify the token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database using the ID hidden inside the token.
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    //Attach the user's information to the request so the Task routes can use it later!
    req.user = user;
    
    // Call next() 
    next();

  } catch (error) {
    // If the token is expired or completely fake, jwt.verify will crash and land here.
    res.status(401).json({ message: "Token is not valid" });
  }
};
  
export default authMiddleware;