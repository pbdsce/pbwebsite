import { NextResponse } from "next/server";
import axios from "axios";
// import { JSDOM } from "jsdom";
import puppeteer from "puppeteer";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { app } from "@/Firebase";

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

export async function POST() {
  try {
    const db = getFirestore(app);

    const API_URL =
      process.env.VJUDGE_CONTEST_API ||
      "https://vjudge.net/contest/data?draw=2&start=0&length=20&sortDir=desc&sortCol=0&category=mine&running=3&title=&owner=Pbhustle&_=1733642420751";

    const { data } = await axios.get(API_URL);
    const ccode = data.data[0][0];

    const url = `https://vjudge.net/contest/${ccode}#rank`;

    const leaderboardRef = doc(db, "hustle", "leaderboard");
    const leaderboardDoc = await getDoc(leaderboardRef);

    const existingData = leaderboardDoc.data() as LeaderboardData | undefined;
    const lastContestCode = existingData?.lastContestCode;

    if (lastContestCode === ccode) {
      console.log("This contest has already been processed. Skipping update.");
      return NextResponse.json({
        message: "Leaderboard is already up-to-date.",
      });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("#contest-rank-table tbody");

    const latest: ContestRanking[] = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("#contest-rank-table tbody tr")
      );
      return rows.slice(0).map((row) => {
        const cells = row.querySelectorAll("td");
        return {
          rank: parseInt(cells[0]?.textContent?.trim() || "0"),
          name: cells[1]?.textContent?.trim() || "",
          score: parseInt(cells[2]?.textContent?.trim() || "0"),
        };
      });
    });

    await browser.close();

    const latestRef = doc(db, "hustle", "latest");
    await setDoc(latestRef, {
      results: latest,
      updateTime: new Date(),
    });

    let rankings: LeaderboardUser[] = existingData?.rankings || [];

    latest.forEach(({ name, score }) => {
      const existingUser = rankings.find((user) => user.name === name);
      if (existingUser) {
        existingUser.score += score;
        existingUser.consistency += 1;
      } else {
        rankings.push({ name, score, consistency: 1 });
      }
    });

    rankings.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.consistency !== a.consistency) return b.consistency - a.consistency;
      return (a.rank || 0) - (b.rank || 0);
    });

    rankings.forEach((user, index) => {
      user.rank = index + 1;
    });

    await setDoc(leaderboardRef, {
      rankings,
      updatedAt: new Date(),
      lastContestCode: ccode,
    });

    return NextResponse.json({
      message: "Leaderboard updated successfully",
      rankings,
    });
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return NextResponse.json({ error: "Failed to update leaderboard" });
  }
}

export async function GET() {
  try {
    const db = getFirestore();

    const latestDoc = await getDoc(doc(db, "hustle", "latest"));
    const leaderboardDoc = await getDoc(doc(db, "hustle", "leaderboard"));

    return NextResponse.json({
      message: "Fetched hustle data successfully",
      data: {
        latest: latestDoc.data(),
        leaderboard: leaderboardDoc.data(),
      },
    });
  } catch (error) {
    console.error("Error fetching hustle data:", error);
    return NextResponse.json({ error: "Failed to fetch hustle data" });
  }
}
