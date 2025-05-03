const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('=== Auth Middleware ===');
    console.log('Headers:', req.headers);
    const token = req.headers['authorization'];
    console.log('Token:', token);
    
    if (!token) {
        console.log('Помилка: токен відсутній');
        return res.status(403).json({ error: 'Токен не предоставлен' });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        (err, decoded) => {
            if (err) {
                console.log('Помилка верифікації токена:', err);
                return res
                    .status(403)
                    .json({ error: 'Не удалось аутентифицировать токен' });
            }
            console.log('Токен верифіковано. User ID:', decoded.id, 'Role:', decoded.role);
            req.userId = decoded.id;
            req.userRole = decoded.role;
            next();
        }
    );
};
