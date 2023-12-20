const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const { Fee, Registration, Expense, Resident } = require('../models/associations');
const generateToken = require('./util/generateToken');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Expense API', () => {
    let testFeeId;
    let testRegId;
    let testResId1;

    before(async () => {
        const testFee = await Fee.create({
            nameFee: "Phí bảo trì",
            amount: 100000,
            type: 1
        });
        testFeeId = testFee.id;
        const testReg = await Registration.create({
            address: "Số 6 Nguyễn Thanh Bình"
        });
        testRegId = testReg.id;
        const testRes1 = await Resident.create({
            idNumber: "001303001303",
            name: "Nguyen Duong Anh",
            dob: new Date(Date.UTC(2023, 11, 23)),
            phoneNumber: "0974223591",
            relationship: "Chau",
            registrationId: testReg.id,
            gender: "Nu"
        });
        testResId1 = testRes1.id;

    })

    const validAccountantToken = generateToken(11, 'anhnd', 'accountant');
    after (async () => {
        await Fee.destroy({
            where: {
                id: testFeeId
            }
        })
        await Registration.destroy({
            where: {
                id: testRegId
            }
        })
    })

    describe('/GET api/expense', () => {
        it('should return a list of expenses for an authenticated accountant', async () => {
            const res = await chai.request(app)
                .get('/api/expense')
                .set('Authorization', `bearer ${validAccountantToken}`);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.greaterThanOrEqual(1);
        })

        it('should return 403 for unauthorized user', async () => {
            //User with role 'resident' 
            const token = generateToken(2, 'testuser', 'resident');
            const res = await chai.request(app)
                .get('/api/expense')
                .set('Authorization', `bearer ${token}`);
            expect(res).to.have.status(403);
        })

        it('should return 401 for invalid token', async () => {
            const token = 'invalid token'
            const res = await chai.request(app)
                .get('/api/expense')
                .set('Authorization', `bearer ${token}`);
            expect(res).to.have.status(401);
        })

    })

    describe('/POST api/expense', () => {
        it('should return 201 for a valid expense', async () => {
            const res = await chai.request(app)
                .post('/api/expense')
                .set('Authorization', `bearer ${validAccountantToken}`)
                .send({
                    feeId: testFeeId,
                    registrationId: testRegId,
                    amount: 100000,
                    date: new Date()
                })
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('feeId', testFeeId);
            expect(res.body).to.have.property('registrationId', testRegId);
            expect(res.body).to.have.property('amount', 100000);
        })

        it('should return 404 for a non-existent fee', async () => {
            const res = await chai.request(app)
                .post('/api/expense')
                .set('Authorization', `bearer ${validAccountantToken}`)
                .send({
                    feeId: 999,
                    registrationId: testRegId,
                    amount: 100000,
                    date: new Date()
                })
            expect(res).to.have.status(404);
        })

        it('should return 404 for a non-existent registration', async () => {
            const res = await chai.request(app)
                .post('/api/expense')
                .set('Authorization', `bearer ${validAccountantToken}`)
                .send({
                    feeId: testFeeId,
                    registrationId: 999,
                    amount: 100000,
                    date: new Date()
                })
            expect(res).to.have.status(404);
        })

        it('should return 403 for a non-accountant', async () => {
            const token = generateToken(2, 'testuser', 'resident');
            const res = await chai.request(app)
                .post('/api/expense')
                .set('Authorization', `bearer ${token}`)
                .send({
                    feeId: testFeeId,
                    registrationId: testRegId,
                    amount: 100000,
                    date: new Date()
                })
            expect(res).to.have.status(403);
        })
    })

    describe('/PUT api/expense', () => {
        it('should return 200 for a valid expense', async () => {
            const res = await chai.request(app)
                .put('/api/expense')
                .set('Authorization', `bearer ${validAccountantToken}`)
                .send({
                    feeId: testFeeId,
                    registrationId: testRegId,
                    amount: 200000,
                    date: new Date()
                })
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('feeId', testFeeId);
            expect(res.body).to.have.property('registrationId', testRegId);
            expect(res.body).to.have.property('amount', 200000);
        })

        it('should return 404 for a non-existent expense', async () => {
            const res = await chai.request(app)
                .put('/api/expense')
                .set('Authorization', `bearer ${validAccountantToken}`)
                .send({
                    feeId: 999,
                    registrationId: testRegId,
                    amount: 200000,
                    date: new Date()
                })
            expect(res).to.have.status(404);
        })

        it('should return 403 for a non-accountant', async () => {
            const token = generateToken(2, 'testuser', 'resident');
            const res = await chai.request(app)
                .put('/api/expense')
                .set('Authorization', `bearer ${token}`)
                .send({
                    feeId: testFeeId,
                    registrationId: testRegId,
                    amount: 100000,
                    date: new Date()
                })
            expect(res).to.have.status(403);
        })
    })

    describe('/DELETE api/expense', () => {
        it('should return 204 for a valid expense', async () => {
            const res = await chai.request(app)
                .delete('/api/expense')
                .set('Authorization', `bearer ${validAccountantToken}`)
                .send({
                    feeId: testFeeId,
                    registrationId: testRegId
                })
            expect(res).to.have.status(204);
        })

        it('should return 404 for a non-existent expense', async () => {
            const res = await chai.request(app)
                .delete('/api/expense')
                .set('Authorization', `bearer ${validAccountantToken}`)
                .send({
                    feeId: 999,
                    registrationId: testRegId
                })
            expect(res).to.have.status(404);
        })

        it('should return 403 for a non-accountant', async () => {
            const token = generateToken(2, 'testuser', 'resident');
            const res = await chai.request(app)
                .delete('/api/expense')
                .set('Authorization', `bearer ${token}`)
                .send({
                    feeId: testFeeId,
                    registrationId: testRegId
                })
            expect(res).to.have.status(403);
        })
    })
})