import bcrypt from 'bcrypt';

export const generateHashedPassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async( password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}