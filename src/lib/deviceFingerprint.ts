/**
 * Device Fingerprinting Utility
 * Generates and manages a persistent device ID for anti-fraud tracking
 */

const DEVICE_ID_KEY = 'arena_device_id';

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get or create device ID
 * This ID persists across sessions and is used to prevent duplicate accounts
 */
export function getDeviceId(): string {
  try {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    
    if (!deviceId) {
      deviceId = generateUUID();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    
    return deviceId;
  } catch (error) {
    console.error('Error accessing localStorage for device ID:', error);
    // Fallback to session-based ID if localStorage is not available
    return generateUUID();
  }
}

/**
 * Fetch user's IP address using ipapi.co service
 * Returns null if unable to fetch
 */
export async function getUserIP(): Promise<string | null> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch IP');
    }
    
    const data = await response.json();
    return data.ip || null;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return null;
  }
}

/**
 * Get device fingerprint data for signup
 */
export async function getDeviceFingerprint(): Promise<{
  deviceId: string;
  ip: string | null;
}> {
  const deviceId = getDeviceId();
  const ip = await getUserIP();
  
  return {
    deviceId,
    ip,
  };
}
