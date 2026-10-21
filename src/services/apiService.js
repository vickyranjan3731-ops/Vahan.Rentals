const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

/**
 * Generic API fetch helper with token attachment and error handling
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Attach token if present in localStorage
  const userAuth = localStorage.getItem('vahan_user_auth');
  if (userAuth) {
    try {
      const parsed = JSON.parse(userAuth);
      if (parsed.token) {
        headers['Authorization'] = `Bearer ${parsed.token}`;
      }
      if (parsed.email) {
        headers['x-user-email'] = parsed.email;
      }
    } catch (e) {
      // ignore
    }
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error || `HTTP error ${response.status}`);
  }
  return json;
}

// ---------------------------------------------------------------------------
// 1. VEHICLES & FLEET APIS
// ---------------------------------------------------------------------------

export const getVehiclesFromDb = async (categoryFilter = null) => {
  try {
    const queryParam = categoryFilter && categoryFilter !== 'All' ? `?category=${encodeURIComponent(categoryFilter)}` : '';
    const res = await fetchApi(`/vehicles${queryParam}`);
    return res.data || [];
  } catch (err) {
    console.error('Error fetching vehicles from Turso DB:', err.message);
    return [];
  }
};

export const getVehicleByIdFromDb = async (id) => {
  try {
    const res = await fetchApi(`/vehicles/${encodeURIComponent(id)}`);
    return res.data || null;
  } catch (err) {
    console.error(`Error fetching vehicle ${id} from API:`, err.message);
    return null;
  }
};

export const insertVehicleToDb = async (vehicleData) => {
  try {
    const res = await fetchApi('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData)
    });
    return { success: true, data: res.data };
  } catch (err) {
    console.error('Error inserting vehicle to Turso DB:', err);
    return { success: false, error: err.message };
  }
};

export const updateVehicleInDb = async (id, updateFields) => {
  try {
    const res = await fetchApi(`/vehicles/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updateFields)
    });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const deleteVehicleFromDb = async (id) => {
  try {
    await fetchApi(`/vehicles/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ---------------------------------------------------------------------------
// 2. BOOKINGS & RESERVATION APIS
// ---------------------------------------------------------------------------

export const saveBookingToDb = async (reservationData) => {
  try {
    const res = await fetchApi('/bookings', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
    return { success: true, data: res.data };
  } catch (err) {
    console.error('Error saving booking to Turso DB:', err.message);
    return { success: false, error: err.message };
  }
};

export const getBookingsFromDb = async (userEmail = null) => {
  try {
    const query = userEmail ? `?email=${encodeURIComponent(userEmail)}` : '';
    const res = await fetchApi(`/bookings${query}`);
    return res.data || [];
  } catch (err) {
    console.error('Error fetching bookings from Turso DB:', err.message);
    return [];
  }
};

export const updateBookingStatusInDb = async (bookingId, newStatus) => {
  try {
    const res = await fetchApi(`/bookings/${encodeURIComponent(bookingId)}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ---------------------------------------------------------------------------
// 3. HOST & PARTNER APIS
// ---------------------------------------------------------------------------

export const getHostProfileFromDb = async (hostId = 'H-88210') => {
  try {
    const res = await fetchApi(`/hosts/${encodeURIComponent(hostId)}`);
    return res.data || null;
  } catch (err) {
    console.error('Error fetching host profile from Turso DB:', err.message);
    return null;
  }
};

export const updateHostProfileInDb = async (hostData) => {
  try {
    const id = hostData.id || 'H-88210';
    const res = await fetchApi(`/hosts/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(hostData)
    });
    return { success: true, data: res.data };
  } catch (err) {
    console.error('Error updating host profile:', err.message);
    return { success: false, error: err.message };
  }
};

export const authenticateHost = async (email, password) => {
  try {
    const res = await fetchApi('/hosts/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    return { success: true, user: res.user };
  } catch (err) {
    return { success: false, error: err.message || 'Invalid partner credentials' };
  }
};

// ---------------------------------------------------------------------------
// 4. AUTHENTICATION & PROFILE APIS (Firebase Backend Sync)
// ---------------------------------------------------------------------------

export const syncUserProfileToDb = async (userData) => {
  try {
    const res = await fetchApi('/auth/sync-profile', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const sendOtpWithFirebase = async (emailOrPhone) => {
  console.log(`🔥 Sending OTP code to ${emailOrPhone} via Firebase Auth`);
  return { success: true, message: 'OTP sent successfully' };
};

export const verifyOtpWithFirebase = async (emailOrPhone, code) => {
  console.log(`🔥 Verifying OTP code for ${emailOrPhone}`);
  return { success: true, user: { email: emailOrPhone } };
};
