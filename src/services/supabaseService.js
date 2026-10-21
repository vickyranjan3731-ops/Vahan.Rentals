/**
 * ==============================================================================
 * VAHAN.RENTALS - UNIFIED BACKEND SERVICE LAYER (TURSO DB & FIREBASE)
 * ==============================================================================
 */

import * as api from './apiService';

// 1. VEHICLES & FLEET APIS
export const getVehiclesFromDb = api.getVehiclesFromDb;
export const getVehicleByIdFromDb = api.getVehicleByIdFromDb;
export const insertVehicleToDb = api.insertVehicleToDb;
export const updateVehicleInDb = api.updateVehicleInDb;
export const deleteVehicleFromDb = api.deleteVehicleFromDb;

// 2. BOOKINGS & RESERVATIONS APIS
export const saveBookingToDb = api.saveBookingToDb;
export const getBookingsFromDb = api.getBookingsFromDb;
export const updateBookingStatusInDb = api.updateBookingStatusInDb;

// 3. HOST & PARTNER APIS
export const getHostProfileFromDb = api.getHostProfileFromDb;
export const updateHostProfileInDb = api.updateHostProfileInDb;
export const authenticateHost = api.authenticateHost;

// 4. FIREBASE AUTH & USER PROFILE APIS
export const sendOtpWithSupabase = async (email) => {
  return api.sendOtpWithFirebase(email);
};

export const verifyOtpWithSupabase = async (email, token) => {
  return api.verifyOtpWithFirebase(email, token);
};

export const signUpWithSupabase = async (email, password, fullName = '', phone = '', role = 'user') => {
  return api.syncUserProfileToDb({ email, fullName, phone, role });
};

export const signInWithSupabase = async (email, password) => {
  return { success: true, user: { email, role: 'user' } };
};

export const signOutFromSupabase = async () => {
  localStorage.removeItem('vahan_user_auth');
  return { success: true };
};

export default {
  getVehiclesFromDb,
  getVehicleByIdFromDb,
  insertVehicleToDb,
  updateVehicleInDb,
  deleteVehicleFromDb,
  saveBookingToDb,
  getBookingsFromDb,
  updateBookingStatusInDb,
  getHostProfileFromDb,
  updateHostProfileInDb,
  authenticateHost,
  sendOtpWithSupabase,
  verifyOtpWithSupabase,
  signUpWithSupabase,
  signInWithSupabase,
  signOutFromSupabase
};
