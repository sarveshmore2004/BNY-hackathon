// hooks/useGetAllStatements.js
import { useState, useEffect } from "react";

const useGetAllStatements = () => {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatements = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/statements");
        if (!response.ok) {
          throw new Error("Failed to fetch statements");
        }
        const data = await response.json();
        setStatements(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatements();
  }, []);

  return { statements, loading, error };
};

export default useGetAllStatements;
