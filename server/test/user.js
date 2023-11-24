const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const { User, Registration, Resident } = require('../models/associations');
const bcrypt = require('bcrypt')
const generateToken = require('./util/generateToken');

chai.use(chaiHttp);
const expect = chai.expect;

describe('User API', () => {

    let testId;
    let testResId;
    let validUserToken;
    before(async () => {
        const testReg = await Registration.create({
            address: "Số 8, Ngô Gia Tự"
        });
        const testRes1 = await Resident.create({
            idNumber: "031303008694",
            name: "Nguyen Tri Dung",
            dob: new Date(Date.UTC(2023, 11, 23)),
            phoneNumber: "0974223591",
            relationship: "child",
            registrationId: testReg.id,
            gender: "male"
        });

        const testRes2 = await Resident.create({
            idNumber: "031303008699",
            name: "Nguyen Mai Phuong",
            dob: new Date(Date.UTC(2023, 11, 23)),
            phoneNumber: "0974223591",
            relationship: "child",
            registrationId: testReg.id,
            gender: "male"
        });

        const testUser = await User.create({
            username: 'testuser',
            passwordHash: await bcrypt.hash('testpassword', 10),
            role: 'resident',
            residentId: testRes1.id,
        })
        testId = testUser.id
        validUserToken = generateToken(testId, 'testuser', 'resident');
        testResId = testRes2.id
    })

    after(async () => {
        after(async () => {
        // Delete all records from the tables
        await User.destroy({ where: {} });
        await Resident.destroy({ where: {} });
        await Registration.destroy({ where: {} });
          });
    });

    // Generate valid token for testing
    const validLeaderToken = generateToken(100, 'phuongnguyen', 'leader');
    const validNonLeaderToken = generateToken(200, 'hagiang', 'resident');

    describe('/GET api/user', () => {
        it('should return a list of users for user leader', async () => {
          const res = await chai.request(app)
            .get('/api/users')
            .set('Authorization', `bearer ${validLeaderToken}`);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
        });
      
        it('should return 401 for unauthorized access (no token)', async () => {
          const res = await chai.request(app)
            .get('/api/users');
          expect(res).to.have.status(401);
        });
      
        it('should return 403 for unauthorized access (non-leader user)', async () => {
          const res = await chai.request(app)
            .get('/api/users')
            .set('Authorization', `bearer ${validNonLeaderToken}`);
          expect(res).to.have.status(403);
        });
      
        it('should return 401 for unauthorized access (invalid token)', async () => {
          const res = await chai.request(app)
            .get('/api/users')
            .set('Authorization', 'bearer invalidToken');
          expect(res).to.have.status(401);
        });
      
      });
      
      describe('/GET api/users/:id', () => {
        it('should return user info with given id for leader', async () => {
          const res = await chai.request(app)
            .get('/api/users/' + testId)
            .set('Authorization', `bearer ${validLeaderToken}`);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
        });

        it('should return user info with given id for user resident own the account', async () => {
            const res = await chai.request(app)
              .get('/api/users/' + testId)
              .set('Authorization', `bearer ${validUserToken}`);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
          });
      
        it('should return 403 for unauthorized access (non-leader user and do not own the account)', async () => {
          const res = await chai.request(app)
            .get('/api/users/' + testId)
            .set('Authorization', `bearer ${validNonLeaderToken}`);
          expect(res).to.have.status(403);
        });
      
        it('should return 404 for non-existent user', async () => {
          const nonExistentUserId = 999;
          const res = await chai.request(app)
            .get('/api/users/' + nonExistentUserId)
            .set('Authorization', `bearer ${validLeaderToken}`);
          expect(res).to.have.status(404);
        });
      
        it('should return 500 for invalid user ID', async () => {
          const invalidUserId = 'invalidId';
          const res = await chai.request(app)
            .get('/api/users/' + invalidUserId)
            .set('Authorization', `bearer ${validLeaderToken}`);
          expect(res).to.have.status(500);
        });

      });
      
      describe('/POST api/users', () => {
        const generateUser = () => ({
          username: 'newuser',
          password: 'newpassword',
          role: 'resident',
          residentId: testResId,
        });
      
        it('should create a new user for user leader', async () => {
          const res = await chai.request(app)
            .post('/api/users')
            .set('Authorization', `bearer ${validLeaderToken}`)
            .send(generateUser());
      
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
        });
      
        it('should return 400 for missing fields', async () => {
          // Omit the username field to simulate missing required field
          const incompleteUser = { ...generateUser() };
          delete incompleteUser.username;
      
          const res = await chai.request(app)
            .post('/api/users')
            .set('Authorization', `bearer ${validLeaderToken}`)
            .send(incompleteUser);
      
          expect(res).to.have.status(400);
        });

      });
      
      describe('/PUT api/users/:id', () => {
        const updatedUserData = {
          password: 'testpassword',
          newPassword: 'updatedpassword',
        };
      
        it('should update user password for user resident own the account', async () => {
          const res = await chai.request(app)
            .put('/api/users/' + testId)
            .set('Authorization', `bearer ${validUserToken}`)
            .send(updatedUserData);
      
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
        });

        it('should return 403 for unauthorized access (other user resident token)', async () => {
          const res = await chai.request(app)
            .put('/api/users/' + testId)
            .set('Authorization', `bearer ${validNonLeaderToken}`)
            .send(updatedUserData);
      
          expect(res).to.have.status(403);
        });

      });
      
      describe('/DELETE api/users/:id', () => {
        it('should delete user for user leader', async () => {
          const res = await chai.request(app)
            .delete('/api/users/' + testId)
            .set('Authorization', `bearer ${validLeaderToken}`);
      
          expect(res).to.have.status(202);
          expect(res.body).to.equal('Delete successfully');
        });
      
        it('should return 404 for non-existent user', async () => {
          const nonExistentUserId = 999;
          const res = await chai.request(app)
            .delete('/api/users/' + nonExistentUserId)
            .set('Authorization', `bearer ${validLeaderToken}`);
      
          expect(res).to.have.status(404);
        });
      });      
});