import { useState, useEffect } from 'react';
import propertyService from '../services/propertyService';

/**
 * Hook to fetch properties with filters and pagination
 */
export function useProperties(params = {}) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await propertyService.getAll(params);
        setProperties(res.data.data);
        setPagination({
          total: res.data.total,
          totalPages: res.data.totalPages,
          currentPage: res.data.currentPage,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [JSON.stringify(params)]);

  return { properties, loading, error, pagination };
}

export default useProperties;
