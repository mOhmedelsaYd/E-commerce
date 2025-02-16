exports.sanitizeUser = (user) => {
    return {
        _id: user.id,
        name: user.name,
        email: user.email,
    }
}