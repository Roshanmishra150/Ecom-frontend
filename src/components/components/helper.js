
import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  try {
    // Generate a salt (a random string)
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error; 
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};