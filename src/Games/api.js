import axios from 'axios';

export const updateScore = async (score) => {
  try {
    const response = await axios.post('https://game-zone-api-v1.azurewebsites.net/api/Scores', score);
    return response.data;
  } catch (error) {
    console.error('Error updating score:', error);
    throw error;
  }
};
