import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

export default authMiddleware;