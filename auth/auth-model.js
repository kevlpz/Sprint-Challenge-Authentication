const db = require('../database/dbConfig.js');

module.exports = {
    get,
    getById,
    getByUsername,
    insert
};

function get() {
    return db('users');
}

function getById(id) {
    return db('users')
        .where({id: id})
        .first();
}

function getByUsername(username) {
    return db('users')
        .where({username: username})
        .first();
}

function insert(user) {
    return db('users')
        .insert(user)
        .then(([id]) => getById(id));
}