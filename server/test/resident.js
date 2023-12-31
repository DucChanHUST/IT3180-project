const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const { User, Registration, Resident } = require('../models/associations');
const generateToken = require('./util/generateToken');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Resident API', () => {

    //Create resident for testing
    let testId;
    let testRegId;
    before(async () => {
        const testReg = await Registration.create({
            address: "Số 9, Tạ Quang Bửu"
        });
        testRegId = testReg.id;
        const testRes = await Resident.create({
            idNumber: "0343008910",
            name: "Nguyen Mai Phuong",
            dob: new Date(Date.UTC(2023, 11, 23)),
            phoneNumber: "0974223591",
            relationship: "Con đẻ",
            registrationId: testRegId,
            gender: "Nữ"
        });
        testId = testRes.id;
    })

    after(async () => {
        // Delete registration inserted in POST
        await Resident.destroy({
            where: {
                idNumber: '0343008911'
            }
        });
        await Registration.destroy({
            where: {
                address: "Số 9, Tạ Quang Bửu"
            }
        });
    });

    // Generate valid token for testing
    const validToken = generateToken(1, 'phuongnguyen', 'leader');

    describe('/GET api/resident', () => {
        it('should return a list of residents for user leader', async () => {
            const res = await chai.request(app)
                .get('/api/resident')
                .set('Authorization', `bearer ${validToken}`);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            // expect(res.body.length).to.be.greaterThanOrEqual(1);
        });
    });

    describe('/GET api/resident/:id', () => {
        it('should return resident with given id', async () => {
            const res = await chai.request(app)
                .get('/api/resident/' + testId)
                .set('Authorization', `bearer ${validToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('id').eql(testId);
            expect(res.body).to.have.property('idNumber');
            // More assertsions ...
        });

        it('should return 404 for not exist id', async () => {
            const listRes = await Resident.findAll();
            let notExistId = listRes.length + 100;

            const res = await chai.request(app)
                .get('/api/resident/' + notExistId)
                .set('Authorization', `bearer ${validToken}`);

            expect(res).to.have.status(404);
            // More assertsions ...
        });
    });
    describe('/POST resident', () => {
        it('should POST a resident', async () => {
            let resident = {
                idNumber: "0343008911",
                name: "Nguyen Mai Phuong",
                dob: new Date(Date.UTC(2023, 11, 23)),
                phoneNumber: "0974223591",
                relationship: "Chủ hộ",
                registrationId: testRegId,
                gender: "Nữ"
            };
            const res = await chai.request(app)
                .post('/api/resident/add')
                .set('Authorization', `bearer ${validToken}`)
                .send(resident);

            expect(res).to.have.status(201);
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('idNumber').eql(resident.idNumber);
        });

        it('should not POST registration without notnull fields', async () => {
            // Thiếu trường name
            let resident = {
                dob: new Date(Date.UTC(2023, 11, 23)),
                phoneNumber: "0974223591",
                relationship: "Con đẻ",
                gender: "Nữ"
            };
            const res = await chai.request(app)
                .post('/api/resident/add')
                .set('Authorization', `bearer ${validToken}`)
                .send(resident);

            expect(res).to.have.status(400);
        });
    });
    describe('/PUT resident', () => {
        it('should UPDATE resident', async () => {
            const res = await chai.request(app)
            .put('/api/resident/update/' + testId)
            .set('Authorization', `bearer ${validToken}`)
            .send({
                name: "New Name"
            });
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name').eql("New Name");
        });

        it('should return status 404 for not exist resident', async () => {
            let notExistId = 10000;
            const res = await chai.request(app)
            .put('/api/resident/update/' + notExistId)
            .set('Authorization', `bearer ${validToken}`)
            .send();
            expect(res).to.have.status(404);
        });
    });

    describe('/DELETE resident', () => {
        it('should DELETE resident with given id ', async () => {
                const res = await chai.request(app)
                  .delete('/api/resident/delete/' + testId)
                  .set('Authorization', `bearer ${validToken}`);
                expect(res).to.have.status(202);
        });
        it('show return 404 for not exist id', async () => {
            let notExistId = 100000;
            const res = await chai.request(app)
              .delete('/api/resident/delete/' + notExistId)
              .set('Authorization', `bearer ${validToken}`);
    
            expect(res).to.have.status(404);
          });
    });
});