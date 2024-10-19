import { useState, useEffect } from "react";

const useGetStatementById = (id) => {
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatement = async () => {
      try {
        setLoading(true);
        // Replace the following URL with your actual API endpoint for fetching a specific statement by ID
        const response = await fetch(`/api/statements/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch statement");
        }
        const data = await response.json();
        setStatement(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStatement();
    }
  }, [id]);

  return { statement, loading, error };
};

export default useGetStatementById;
