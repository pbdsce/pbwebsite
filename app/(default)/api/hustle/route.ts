import { NextResponse } from "next/server";
import axios from "axios";
import connectMongoDB from "@/lib/dbConnect";
import { LatestModel, LeaderboardModel } from "@/models/PbHustel";
import { lead } from "@/app/(default)/api/hustle/leaderboard"; // Change .js to .ts

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
 * /api/hustle:
 *   post:
 *     summary: Update the leaderboard with latest contest data
 *     description: This endpoint fetches the latest contest data and updates the leaderboard rankings and the latest results.
 *     tags:
 *       - Hustle
 *     responses:
 *       200:
 *         description: Leaderboard updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Leaderboard updated successfully"
 *                 rankings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: number
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       score:
 *                         type: number
 *                         example: 1000
 *       400:
 *         description: Failed to update leaderboard due to validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update leaderboard"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update leaderboard"
 */

/**
 * @swagger
 * /api/hustle:
 *   get:
 *     summary: Fetch the latest hustle data (leaderboard and latest results)
 *     description: This endpoint retrieves the latest leaderboard rankings and results of the most recent contest.
 *     tags:
 *       - Hustle
 *     responses:
 *       200:
 *         description: Successfully fetched hustle data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Fetched hustle data successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     latest:
 *                       type: object
 *                       properties:
 *                         results:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               rank:
 *                                 type: number
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: "John Doe"
 *                               score:
 *                                 type: number
 *                                 example: 1000
 *                         updateTime:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-23T14:00:00Z"
 *                     leaderboard:
 *                       type: object
 *                       properties:
 *                         rankings:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               rank:
 *                                 type: number
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: "John Doe"
 *                               score:
 *                                 type: number
 *                                 example: 1000
 *                               consistency:
 *                                 type: number
 *                                 example: 5
 *       400:
 *         description: Failed to fetch hustle data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch hustle data"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch hustle data"
 */

export async function POST() {
  try {
    await connectMongoDB();

    const API_URL =
      process.env.VJUDGE_CONTEST_API ||
      "https://vjudge.net/contest/data?draw=2&start=0&length=20&sortDir=desc&sortCol=0&category=mine&running=3&title=&owner=Pbhustle&_=1733642420751";

    const { data } = await axios.get(API_URL);
    const ccode = data.data[0][0];
    const { data: rankData } = await axios.get(
      `https://vjudge.net/contest/rank/single/${ccode}`
    );

    const leaderboardDoc = await LeaderboardModel.findOne({
      name: "leaderboard",
    });

    const existingData = leaderboardDoc as LeaderboardData | undefined;
    const lastContestCode = existingData?.lastContestCode;
    console.log("Last contest code", lastContestCode);
    console.log("Current contest code", ccode);
    
    if (Number(lastContestCode) == Number(ccode)) {
      console.log("Leaderboard is already up-to-date.");
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
  } catch (error) {
    return NextResponse.json({ error: "Failed to update leaderboard" });
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const latestDoc = await LatestModel.findOne({ name: "latest" });
    const leaderboardDoc = await LeaderboardModel.findOne({
      name: "leaderboard",
    });

    return NextResponse.json({
      message: "Fetched hustle data successfully",
      data: {
        latest: latestDoc,
        leaderboard: leaderboardDoc,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hustle data" });
  }
}

