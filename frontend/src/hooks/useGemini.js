import { useState } from "react";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const processText = async (text) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from Gemini API");
      }

      const data = await response.json();
      setResult(data.candidates[0].content.parts[0].text);
      return data.candidates[0].content.parts[0].text;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { processText, loading, result, error };
};

export default useGemini;
