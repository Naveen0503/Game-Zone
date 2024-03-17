import PouchDB from 'pouchdb-browser';

const DB_NAME = 'userdb';
const db = new PouchDB(DB_NAME);

// Function to create a new user
export const createUser = async (userData) => {
    try {
        const response = await db.post(userData);
        return response;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Function to get user by name
export const getUserByName = async (name) => {
    try {
        const response = await db.find({
            selector: { name: { $eq: name } }
        });
        return response.docs[0]; // Assuming there's only one user with this name
    } catch (error) {
        console.error('Error getting user by name:', error);
        throw error;
    }
};

// Function to update user
export const updateUser = async (userData) => {
    try {
        const response = await db.put(userData);
        return response;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Function to delete user
export const deleteUser = async (id) => {
    try {
        const user = await db.get(id);
        const response = await db.remove(user);
        return response;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
