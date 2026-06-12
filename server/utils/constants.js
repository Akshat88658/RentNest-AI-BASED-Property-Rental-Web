/**
 * Constants used across the server
 */

exports.ROLES = {
  TENANT: 'tenant',
  LANDLORD: 'landlord',
  ADMIN: 'admin',
};

exports.PROPERTY_TYPES = [
  'apartment',
  'house',
  'villa',
  'studio',
  'condo',
  'penthouse',
  'other',
];

exports.BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

exports.PROPERTY_STATUS = {
  AVAILABLE: 'available',
  RENTED: 'rented',
  MAINTENANCE: 'maintenance',
  UNLISTED: 'unlisted',
};
