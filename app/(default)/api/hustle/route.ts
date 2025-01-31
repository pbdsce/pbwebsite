import { NextResponse } from "next/server";
import axios from "axios";
import connectMongoDB from "@/lib/dbConnect";
import { LatestModel, LeaderboardModel } from "@/models/PbHustel";
import { lead } from "@/app/(default)/api/hustle/leaderboard";

interface ContestRanking {
  rank: number;
  name: string;
  score: number;
}

interface LeaderboardUser {
  name: string;
  score: number;
  consistency: number;
  rank?: number;
}

interface LeaderboardData {
  rankings?: LeaderboardUser[];
  updatedAt?: Date;
  lastContestCode?: string;
}

/**
 * @swagger
 * /api/hustle/update:
 *   post:
 *     summary: Fetches and updates the leaderboard from VJudge.
 *     description: Fetches contest data from VJudge API, updates the leaderboard, and stores it in the database.
 *     responses:
 *       200:
 *         description: Successfully updated leaderboard
 *       400:
 *         description: Invalid response from VJudge or missing data.
 *       500:
 *         description: Error while processing or updating data.
 */
export async function POST() {
  try {
    await connectMongoDB();

    const API_URL =
      process.env.VJUDGE_CONTEST_API ||
      "https://vjudge.net/contest/data?draw=2&start=0&length=20&sortDir=desc&sortCol=0&category=mine&running=3&title=&owner=Pbhustle&_=1733642420751";

    const headers = {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json, text/plain, */*',
      'Referer': 'https://vjudge.net/',
      'Origin': 'https://vjudge.net',
      'Cookie': process.env.VJUDGE_COOKIE || ''
    };

    const { data } = await axios.get(API_URL, { headers });
    
    if (!data || !data.data || !data.data[0]) {
      return NextResponse.json({ 
        error: "Invalid response from VJudge",
        details: "No contest data available"
      }, { status: 400 });
    }

    const ccode = data.data[0][0];
    const { data: rankData } = await axios.get(
      `https://vjudge.net/contest/rank/single/${ccode}`,
      { headers }
    );

    const leaderboardDoc = await LeaderboardModel.findOne({ name: "leaderboard" });
    const existingData = leaderboardDoc as LeaderboardData | undefined;
    const lastContestCode = existingData?.lastContestCode;
    
    if (Number(lastContestCode) == Number(ccode)) {
      return NextResponse.json({
        message: "Leaderboard is already up-to-date.",
      });
    }

    const contestLengthInSeconds = rankData.length / 1000;
    const boardRankings = lead(rankData, contestLengthInSeconds);

    const latest: ContestRanking[] = boardRankings.map((user, index) => ({
      rank: index + 1,
      name: `${user.nam} (${user.disp})`,
      score: user.tot,
    }));

    await LatestModel.findOneAndUpdate(
      { name: "latest" },
      {
        $set: {
          results: latest,
          updateTime: new Date(),
        },
      },
      { upsert: true }
    );

    let leaderboardRankings: LeaderboardUser[] = existingData?.rankings || [];

    latest.forEach(({ name, score }) => {
      const existingUser = leaderboardRankings.find(
        (user) => user.name === name
      );
      if (existingUser) {
        existingUser.score += score;
        existingUser.consistency += 1;
      } else {
        leaderboardRankings.push({ name, score, consistency: 1 });
      }
    });

    leaderboardRankings.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.consistency !== a.consistency) return b.consistency - a.consistency;
      return (a.rank || 0) - (b.rank || 0);
    });

    leaderboardRankings.forEach((user, index) => {
      user.rank = index + 1;
    });

    await LeaderboardModel.findOneAndUpdate(
      { name: "leaderboard" },
      {
        $set: {
          rankings: leaderboardRankings,
          updatedAt: new Date(),
          lastContestCode: ccode,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: "Leaderboard updated successfully",
      rankings: leaderboardRankings,
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Failed to update leaderboard",
      details: error.message,
      status: 500
    }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/hustle/fetch:
 *   get:
 *     summary: Fetches the latest and leaderboard data from the database.
 *     description: Fetches the latest contest results and leaderboard rankings from the database.
 *     responses:
 *       200:
 *         description: Successfully fetched hustle data
 *       500:
 *         description: Error while fetching data from the database.
 */
export async function GET() {
  try {
    await connectMongoDB();
    const latestDoc = await LatestModel.findOne({ name: "latest" });
    const leaderboardDoc = await LeaderboardModel.findOne({ name: "leaderboard" });

    return NextResponse.json({
      message: "Fetched hustle data successfully",
      data: {
        latest: latestDoc,
        leaderboard: leaderboardDoc,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Failed to fetch hustle data",
      details: error.message 
    }, { status: 500 });
  }
}
