export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'studio', label: 'Studio' },
  { value: 'condo', label: 'Condo' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'other', label: 'Other' },
];

export const FURNISHED_OPTIONS = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
  { value: 'fully-furnished', label: 'Fully Furnished' },
];

export const BOOKING_STATUS_LABELS = {
  pending: { label: 'Pending', color: '#f59e0b' },
  approved: { label: 'Approved', color: '#10b981' },
  rejected: { label: 'Rejected', color: '#ef4444' },
  active: { label: 'Active', color: '#3b82f6' },
  completed: { label: 'Completed', color: '#6b7280' },
  cancelled: { label: 'Cancelled', color: '#9ca3af' },
};

export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/properties', label: 'Properties' },
  { path: '/ai-chat', label: 'AI Assistant', protected: true },
  { path: '/bookings', label: 'My Bookings', protected: true, roles: ['tenant', 'user'] },
  { path: '/dashboard', label: 'My Properties', protected: true, roles: ['landlord', 'admin'] },
];
