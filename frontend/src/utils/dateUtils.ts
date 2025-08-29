/**
 * Safe date formatting utilities that handle null, undefined, invalid dates, and Firebase Timestamps gracefully
 */

// Type for Firebase Timestamp objects
interface FirebaseTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

/**
 * Converts Firebase Timestamp to Date object
 * @param timestamp - Firebase Timestamp object
 * @returns Date object
 */
const convertFirebaseTimestamp = (timestamp: FirebaseTimestamp): Date => {
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
};

/**
 * Checks if an object is a Firebase Timestamp
 * @param obj - Object to check
 * @returns True if object is a Firebase Timestamp
 */
const isFirebaseTimestamp = (obj: unknown): obj is FirebaseTimestamp => {
  return (
    obj !== null &&
    obj !== undefined &&
    typeof obj === 'object' &&
    '_seconds' in obj &&
    '_nanoseconds' in obj &&
    typeof (obj as FirebaseTimestamp)._seconds === 'number' &&
    typeof (obj as FirebaseTimestamp)._nanoseconds === 'number'
  );
};

/**
 * Safely converts various date formats to Date object
 * @param date - The date to convert (Date, string, number, Firebase Timestamp, null, or undefined)
 * @returns Date object or null if invalid
 */
const toDate = (
  date: Date | string | number | FirebaseTimestamp | null | undefined,
): Date | null => {
  if (!date) return null;

  try {
    // Handle Firebase Timestamp
    if (isFirebaseTimestamp(date)) {
      return convertFirebaseTimestamp(date);
    }

    // Handle regular dates
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    return dateObj;
  } catch {
    return null;
  }
};

/**
 * Safely formats a date to a localized date string
 * @param date - The date to format (can be Date, string, number, Firebase Timestamp, null, or undefined)
 * @returns Formatted date string or fallback message
 */
export const formatDate = (
  date: Date | string | number | FirebaseTimestamp | null | undefined,
): string => {
  const dateObj = toDate(date);
  if (!dateObj) return 'Date not available';

  try {
    return dateObj.toLocaleDateString();
  } catch {
    return 'Date not available';
  }
};

/**
 * Safely formats a date to a localized date and time string
 * @param dateValue - The date value to format (can be Date, string, number, Firebase Timestamp, null, or undefined)
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  dateValue: Date | string | number | FirebaseTimestamp | null | undefined,
): string => {
  const dateObj = toDate(dateValue);
  if (!dateObj) return 'Date not available';

  try {
    return dateObj.toLocaleString();
  } catch {
    return 'Date not available';
  }
};

/**
 * Gets the relative age of a date (days since creation)
 * @param dateValue - The date value to calculate from (can be Date, string, number, Firebase Timestamp, null, or undefined)
 * @returns Number of days since the date, or null if invalid
 */
export const getDateAge = (
  dateValue: Date | string | number | FirebaseTimestamp | null | undefined,
): number | null => {
  const dateObj = toDate(dateValue);
  if (!dateObj) return null;

  try {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch {
    return null;
  }
};
