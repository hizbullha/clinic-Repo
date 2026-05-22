import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No authentication token provided' });
  }

  try {
 
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
   
    req.user = verified;
    
 
    next(); 
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired session token' });
  }
};