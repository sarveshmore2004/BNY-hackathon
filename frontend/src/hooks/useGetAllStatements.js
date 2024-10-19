// hooks/useGetAllStatements.js
import { useState } from "react";

const useGetAllStatements = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
    const fetchStatements = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/statements");
        if (!response.ok) {
          throw new Error("Failed to fetch statements");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

  return { fetchStatements, loading, error };
};

export default useGetAllStatements;
