const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); 
const { User } = require('../models/associations');
const bcrypt = require('bcrypt');

chai.use(chaiHttp);
const expect = chai.expect;

describe('/POST api/login', () => {
  const testUser = {
    username: 'testuser',
    password: 'testpassword',
  };

  before(async () => {
    // Create a test user for login
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await User.create({
      username: testUser.username,
      passwordHash: hashedPassword,
      role: 'resident',
    });
  });

  it('should return a valid token on successful login', async () => {
    const res = await chai.request(app)
      .post('/api/login')
      .send(testUser);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('token');
    expect(res.body).to.have.property('userId');
    expect(res.body).to.have.property('userRole');
  });

  it('should return 401 for invalid credentials', async () => {
    const invalidCredentials = {
      username: 'nonexistentuser',
      password: 'invalidpassword',
    };

    const res = await chai.request(app)
      .post('/api/login')
      .send(invalidCredentials);

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('error', 'invalid username or password');
  });

  after(async () => {
    // Clean up test data (delete the test user)
    await User.destroy({
      where: {
        username: testUser.username,
      },
    });
  });
});
