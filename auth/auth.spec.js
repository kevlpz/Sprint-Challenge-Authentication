const request = require('supertest');
const server = require('../api/server.js');
const db = require('../database/dbConfig');

describe('/auth', () => {
    describe('/register register new user', () => {
        it('should return 201', () => {
            return request(server).post('/api/auth/register')
                .send({
                    username: 'test0',
                    password: 'pass'
                })
                .then(res => expect(res.status).toBe('201'))
        })
        it('should return user', () => {
            return request(server).post('/api/auth/register')
                .send({
                    username: 'test0000',
                    password: 'pass'
                })
                .then(res => {
                    console.log('res', res.body);
                    expect(res.body.username).toBe('test0000');
                })
        })
    })

    describe('/login log in', () => {
        it('should return 200', () => {
            return request(server).post('/api/auth/login')
                .send({
                    username: 'test',
                    password: 'pass'
                })
                .then(res => expect(res.status).toBe(200))
        })
        it('should return token', () => {
            return request(server).post('/api/auth/login')
                .send({
                    username: 'test',
                    password: 'pass'
                })
                .then(res => expect(res.body.token).toBeTruthy())
        })
    })
})