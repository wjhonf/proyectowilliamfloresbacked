function isAdmin(req, res, next) {
    const currentUser = req.user; 

    if (currentUser.role === 'admin' || currentUser.role === 'premium') {
        next(); 
    } else {
        res.redirect('/home?error=Acceso%20denegado');
    }
}

function isUser(req, res, next) {
    const currentUser = req.user; 
    console.log(currentUser)
    if (currentUser.role === 'user' || currentUser.role === 'premium') {
        next();
    } else {
        res.redirect('/home?error=Acceso%20denegado');
    }
}

module.exports = { isAdmin, isUser };
