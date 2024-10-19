// hooks/usePostStatement.js
import { useState } from "react";

const usePostStatement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postStatement = async (tableData, accuracy) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/statements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactions: tableData.map((item) => item._id),
          accuracy: accuracy,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post statement");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { postStatement, loading, error };
};

export default usePostStatement;
