import fs from 'fs';

const createUploadsFolder = () => {
  const path = './uploads';
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
};

export { createUploadsFolder };