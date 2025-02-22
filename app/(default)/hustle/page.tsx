"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, RefreshCw, TableProperties } from "lucide-react";
import { auth } from "../../../Firebase"; // Firebase setup
import { onAuthStateChanged } from "firebase/auth";
import { useStore} from "@/lib/zustand/store";
import LoadingBrackets from "@/components/ui/loading-brackets";

interface Result {
  rank: number;
  name: string;
  score: number;
  consistency?: number[]; // For Rankings only
}

export default function ResultsTable() {
  const [tab, setTab] = useState<"latest" | "rankings">("latest");
  // const [isLoggedIn, setLoggedIn] = useState(false);
  const [latestResults, setLatestResults] = useState<Result[]>([]);
  const [rankings, setRankings] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  // const [isLoggedInLoggedIn, setLoggedInLoggedIn] = useState(false);
  const { isLoggedIn , setLoggedIn } = useStore();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/hustle", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        if (response.ok && data?.data) {
          const allDocs = data.data;
          const latestData: Result[] = allDocs.latest.results || [];
          const rankingsData: Result[] = allDocs.leaderboard.rankings || [];
          const updatedAt: Date = new Date(allDocs.leaderboard.updatedAt);

          setLatestResults(latestData);
          setRankings(rankingsData);
          setLastUpdated(updatedAt);
        } else {
          console.error("Error in response:", data.error);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch results:", error);
        setLoading(false);
      }
    };

    // const checkAdmin = async (uid: string) => {
    //   try {
    //     const response = await fetch(`/api/admin?uid=${uid}`);
    //     const { isLoggedIn } = await response.json();
    //     setLoggedIn(isLoggedIn);
    //   } catch (error) {
    //     console.error("Error checking admin status:", error);
    //     setLoggedIn(false);
    //   }
    // };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    fetchData();

    return () => unsubscribe();
  }, [isLoggedIn]);

  const handleGetResults = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/hustle", {
        method: "POST", // Specify the request method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: "value" }),
      });

      if (res.ok) {
        alert("Scraper executed successfully!");
      } else {
        alert("Failed to update results.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error triggering scraper:", error);
      setLoading(false);
    }
  };

  const renderTable = (data: Result[], showConsistency: boolean) => (
    <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-700">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase bg-gray-800 text-[#00FF66]">
          <tr>
            <th className="px-6 py-4">Rank</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((result, index) => (
            <tr
              key={index}
              className="border-b bg-gray-900 border-gray-700 hover:bg-gray-800 transition-colors"
            >
              <td className="px-6 py-4 font-medium whitespace-nowrap text-[#00FF66]">
                {result.rank}
              </td>
              <td className="px-6 py-4">{result.name}</td>
              <td className="px-6 py-4 font-semibold">{result.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto pt-14">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 text-[#00FF66] flex items-center justify-center gap-4">
            <Trophy className="w-12 h-12" /> PB HUSTLE
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Track latest results and overall rankings in real-time
          </p>
        </motion.header>

        <div className="flex justify-center space-x-6 mb-8">
          {(["latest", "rankings"] as const).map((tabName) => (
            <button
              key={tabName}
              onClick={() => setTab(tabName)}
              className={`
                px-6 py-3 rounded-full flex items-center gap-3 transition-all text-lg font-semibold
                ${
                  tab === tabName
                    ? "bg-[#00FF66] text-gray-900 shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }
              `}
            >
              <TableProperties className="w-6 h-6" />
              {tabName === "latest" ? "Latest Results" : "Rankings"}
            </button>
          ))}
        </div>
        {isLoggedIn && isLoggedIn && tab === "latest" && (
          <div className="flex justify-center mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetResults}
              disabled={loading}
              className="
                bg-[#00FF66] text-gray-900 px-8 py-3 rounded-full 
                flex items-center gap-3 shadow-lg hover:bg-opacity-90 text-lg font-semibold
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <RefreshCw className="w-6 h-6" />
              {loading ? "Updating..." : "GET LATEST RESULTS"}
            </motion.button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingBrackets />
          </div>
        ) : (
          <>
            {lastUpdated && (
              <div className="text-center mb-4 text-white">
                Last updated: {lastUpdated.toLocaleString()}
              </div>
            )}
            {renderTable(
              tab === "latest" ? latestResults : rankings,
              tab === "rankings"
            )}
          </>
        )}
      </div>
    </div>
  );
}
