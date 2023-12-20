const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const { Fee } = require('../models/associations');
const generateToken = require('./util/generateToken');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Fee API', () => {
    let testFeeId;

    before(async () => {
        const testFee = await Fee.create({
            nameFee: "Phí bảo trì",
            amount: 100000,
            type: 1
        });
        testFeeId = testFee.id;
    })

    const validAccountantToken = generateToken(11, 'anhnd', 'accountant');

    after(async () => {
        await Fee.destroy({
            where: {
                id: testFeeId
            }
        })
    })

    describe('/POST api/fee', () => { 
        it('should return 201 for a valid fee', async () => {
            const res = await chai.request(app)
                .post('/api/fee')
                .set('Authorization', `bearer ${validAccountantToken}`)
                .send({
                    nameFee: "Phí môi trường",
                    amount: 100000,
                    type: 1
                })
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('nameFee', 'Phí môi trường');
            expect(res.body).to.have.property('amount', 100000);
            expect(res.body).to.have.property('type', 1);
        })

        it('should return 422 for a compulsory fee without amount', async () => {
            const res = await chai.request(app)
                .post('/api/fee')
                .set('Authorization', `bearer ${validAccountantToken}`)
                .send({
                    nameFee: "Phí bảo trì",
                    type: 1
                })
            expect(res).to.have.status(422);
        })

        it('should return 403 for a non-accountant', async () => {
            const token = generateToken(2, 'testuser', 'resident');
            const res = await chai.request(app)
                .post('/api/fee')
                .set('Authorization', `bearer ${token}`)
                .send({
                    nameFee: "Phí bảo trì",
                    amount: 100000,
                    type: 1
                })
            expect(res).to.have.status(403);
        })
    })

    describe('PUT api/fee/:id', () => {
        it('should return 200 for a valid fee', async () => {
            const res = await chai.request(app)
                .put('/api/fee/' + testFeeId)
                .set('Authorization', `bearer ${validAccountantToken}`)
                .send({
                    nameFee: "Phí môi trường",
                    amount: 100000,
                    type: 1
                })
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('nameFee', 'Phí môi trường');
            expect(res.body).to.have.property('amount', 100000);
            expect(res.body).to.have.property('type', 1);
        })

        it('should return 404 for a non-existed fee', async () => {
            const res = await chai.request(app)
                .put('/api/fee/100')
                .set('Authorization', `bearer ${validAccountantToken}`)
                .send({
                    nameFee: "Phí môi trường",
                    amount: 100000,
                    type: 1
                })
            expect(res).to.have.status(404);
        })

        it('should return 403 for a non-accountant', async () => {
            const token = generateToken(2, 'testuser', 'resident');
            const res = await chai.request(app)
                .put('/api/fee/' + testFeeId)
                .set('Authorization', `bearer ${token}`)
                .send({
                    nameFee: "Phí môi trường",
                    amount: 100000,
                    type: 1
                })
            expect(res).to.have.status(403);
        })
    })

    describe('DELETE api/fee/:id', () => {
        it('should return 204 for a valid fee', async () => {
            const res = await chai.request(app)
                .delete('/api/fee/' + testFeeId)
                .set('Authorization', `bearer ${validAccountantToken}`)
            expect(res).to.have.status(204);
        })

        it('should return 404 for a non-existed fee', async () => {
            const res = await chai.request(app)
                .delete('/api/fee/100')
                .set('Authorization', `bearer ${validAccountantToken}`)
            expect(res).to.have.status(404);
        })

        it('should return 403 for a non-accountant', async () => {
            const token = generateToken(2, 'testuser', 'resident');
            const res = await chai.request(app)
                .delete('/api/fee/' + testFeeId)
                .set('Authorization', `bearer ${token}`)
            expect(res).to.have.status(403);
        })
    })
});