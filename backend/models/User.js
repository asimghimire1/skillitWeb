const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data.json');

const readData = () => {
  const data = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

class User {
  static async create(email, fullname, password, role) {
    const data = readData();
    const newUser = {
      id: data.users.length + 1,
      email,
      fullname,
      password,
      role,
      created_at: new Date().toISOString()
    };
    data.users.push(newUser);
    writeData(data);
    return newUser;
  }

  static async findByEmail(email) {
    const data = readData();
    return data.users.find(u => u.email === email);
  }

  static async findById(id) {
    const data = readData();
    const user = data.users.find(u => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return user;
  }

  static async update(id, fullname, role) {
    const data = readData();
    const userIndex = data.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      data.users[userIndex].fullname = fullname;
      data.users[userIndex].role = role;
      writeData(data);
      return data.users[userIndex];
    }
    return null;
  }

  static async getAll() {
    const data = readData();
    return data.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

module.exports = User;
