// process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const { User, Registration, Resident } = require('../models/associations');
const generateToken = require('./util/generateToken');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Registration API', () => {

  //Add a registration to the database before running the test
  let testId;
  before(async () => {
    const testReg = await Registration.create({
      address: '7 Tạ Quang Bửu'
    });
    testId = testReg.id;
  });

  // Generate valid token for testing
  const validToken = generateToken(1, 'phuongnguyen', 'leader');

  after(async () => {
    // Delete registration inserted in POST
    await Registration.destroy({
      where: {
        address: 'Số 7, Tạ Quang Bửu'
      },
    });
  });



  describe('/GET api/registration', () => {

    it('should return a list of registrations for an authenticated leader', async () => {
      const res = await chai.request(app)
        .get('/api/registration')
        .set('Authorization', `bearer ${validToken}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThanOrEqual(1);
    });

    it('should return 403 for unauthorized user', async () => {
      //User with role 'resident' 
      const token = generateToken(2, 'testuser', 'resident');
      const res = await chai.request(app)
        .get('/api/registration')
        .set('Authorization', `bearer ${token}`);
      expect(res).to.have.status(403);
    });

    it('should return 401 for invalid token', async () => {
      const token = 'invalid token'
      const res = await chai.request(app)
        .get('/api/registration')
        .set('Authorization', `bearer ${token}`);
      expect(res).to.have.status(401);
    });

    it('should return 401 for invalid token', async () => {
      const res = await chai.request(app)
        .get('/api/registration')
      expect(res).to.have.status(401);
    });
  });

  describe('/GET by id', () => {

    it('should return registration has id provied', async () => {
      const res = await chai.request(app)
        .get('/api/registration/' + testId)
        .set('Authorization', `bearer ${validToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('id').eql(testId);
      expect(res.body).to.have.property('address');
    });

    it('should return 404 for not exist registration', async () => {
      let notExistId = 100;
      const res = await chai.request(app)
        .get('/api/registration/' + notExistId)
        .set('Authorization', `bearer ${validToken}`);

      expect(res).to.have.status(404);
    })
  });

  describe('/POST registration', () => {
    it('should POST a registration', async () => {
      let regis = {
        address: 'Số 7, Tạ Quang Bửu'
      }
      const res = await chai.request(app)
        .post('/api/registration/add')
        .set('Authorization', `bearer ${validToken}`)
        .send(regis);

      expect(res).to.have.status(201);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('address').eql(regis.address);
    });

    it('should not POST registration without address field', async () => {
      let regis = {
      }
      const res = await chai.request(app)
        .post('/api/registration/add')
        .set('Authorization', `bearer ${validToken}`)
        .send(regis);

      expect(res).to.have.status(400);
    });

    describe('/PUT registration', () => {
      it('shoule UPDATE registration has given id', async () => {
        const res = await chai.request(app)
          .put('/api/registration/update/' + testId)
          .set('Authorization', `bearer ${validToken}`)
          .send({
            address: "Số 8 Tạ Quang Bửu"
          });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id').eql(testId);
        expect(res.body).to.have.property('address').eql("Số 8 Tạ Quang Bửu");
      });

      it('should return status 404 for not exits registration', async () => {
        let notExistId = 1000;
        const res = await chai.request(app)
          .put('/api/registration/update/' + notExistId)
          .set('Authorization', `bearer ${validToken}`)
          .send({
            address: " "
          });
        expect(res).to.have.status(404);
      });
    });

    describe('/DELETE registration', () => {
      it('should DELETE registration with given id', async () => {
        const res = await chai.request(app)
          .delete('/api/registration/delete/' + testId)
          .set('Authorization', `bearer ${validToken}`);

        expect(res).to.have.status(202);
      });
      it('show return 404 for invalid id', async () => {
        let notExistId = 100000;
        const res = await chai.request(app)
          .delete('/api/registration/delete/' + notExistId)
          .set('Authorization', `bearer ${validToken}`);

        expect(res).to.have.status(404);
      });
    });
  });
});




