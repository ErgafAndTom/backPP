module.exports = async function filtrForAcessGroup(req, res, next, requiredGroup) {
    return function(req, res, next) {
        // Тут логіка для отримання групи допуску користувача, наприклад, з JWT токена
        const userGroup = req.user.role; // Припустимо, що req.user ми вже отримали з іншого мідлвару

        if (userGroup >= requiredGroup) {
            next();
        } else {
            res.status(403).send('Недостатньо прав для доступу');
        }
    };
}