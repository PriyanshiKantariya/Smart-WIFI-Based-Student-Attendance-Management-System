
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';

export const getUsername = async () => {
  try {
    return await SecureStore.getItemAsync('usernaame');
  } catch (e) {
    console.error('Failed to fetch the username.', e);
  }
};