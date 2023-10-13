
import * as SecureStore from 'expo-secure-store';

export const getUsername = async () => {
  try {
    return await SecureStore.getItemAsync('usernaame');
  } catch (e) {
    console.error('Failed to fetch the username.', e);
  }
};

export const getname = async () => {
  try {
    return await SecureStore.getItemAsync('name');
  } catch (error) {
    console.error('Failed to fetch the username.', e);
  }
};
