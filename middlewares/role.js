const db = require('../models');

module.exports = (roles) => {
    return async (req, res, next) => {
        try {
            console.log('=== Role Middleware ===');
            console.log('Required roles:', roles);
            console.log('User ID:', req.userId);
            
            const user = await db.User.findByPk(req.userId);
            if (!user) {
                console.log('Помилка: користувача не знайдено');
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            
            console.log('User role:', user.role);
            if (!roles.includes(user.role)) {
                console.log('Помилка: недостатньо прав');
                return res
                    .status(403)
                    .json({ error: 'У вас нет доступа к этому ресурсу' });
            }
            
            console.log('Перевірка ролі успішна');
            next();
        } catch (error) {
            console.error('Помилка перевірки ролі:', error);
            res.status(500).json({ error: 'Ошибка при проверке прав доступа' });
        }
    };
};
