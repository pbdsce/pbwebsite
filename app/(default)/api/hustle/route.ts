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

export async function POST() {
  try {
    await connectMongoDB();

    const API_URL =
      process.env.VJUDGE_CONTEST_API ||
      "https://vjudge.net/contest/data?draw=2&start=0&length=20&sortDir=desc&sortCol=0&category=mine&running=3&title=&owner=Pbhustle&_=1733642420751";

    // Add headers to mimic a browser request
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://vjudge.net/',
      'Origin': 'https://vjudge.net',
      'Cookie': process.env.VJUDGE_COOKIE || 'JSESSlONID=7YP9VCUCK4ZTTTNQO0U0OQFW6ZDHMJXV; _ga=GA1.1.533089565.1728634731; Jax.Q=04yash|PMVRLFQGIPE5GOTC1SGE6B4W785LQJ; __gads=ID=99f1126d6fe46914:T=1728634731:RT=1737718428:S=ALNI_Mb_KPRQ0uquyzQSN44fpJKwUo53GA; __gpi=UID=00000f3e7503e3cd:T=1728634731:RT=1737718428:S=ALNI_Mb0ueGqLg2jRi_frTwTAZsUQqg_wQ; __eoi=ID=9732350f6625bc1b:T=1728634731:RT=1737718428:S=AA-AfjZnX0ZhSiL1BHBPEMWVFpeh; cf_clearance=rHe4M.4i47txtgYJQPXs0a.LnH.QYSRELQUQKvBeHv0-1737728607-1.2.1.1-QS6DaWVn4ZlR0CDzelDl644mlMOCZU1ty_NqdHf68O5PjZEOniNFWXUEEk3GrVQj0CwVlOScM6DpclcDaZKTv39_vxVd.tdzDDdfI3hBk.BKBOopC_pgojfmWDpHxvMqGBJbqfcoq36wQJQchRX4B0.IUalcf8OnqtyKwFa6mOj1a1oNoBst3jz_nVLMzWjzzQsxtJmhLlSGveAigCmovzVeHuJsXGSGifWipcLBKO2U_QCnzDVWlZ5N0Rqs7qlOPhzT9xmvceNQGlIZLoINYpq5_WyfCbumeC6XsX0i.H4; FCNEC=%5B%5B%22AKsRol-aSOdWtkNjxLPUwAZiyc5kmxDI81NA-AWYxiD_dMfHxJZ0hX5MBVRm9H0Pb0bLbRu7vmWOG3ZJAKwynbFz-3CLj98y_Ps-u7uC3PX4myF02jFz23muu0K9r3Xot0YQRKs-gKcJoQetbuaLAVrOLTIdtXKr4w%3D%3D%22%5D%5D; JSESSIONID=E55418E82CB952060BE04F7A459FD1FF; _ga_374JLX1715=GS1.1.1737728605.51.1.1737729138.60.0.0',
    };

    const { data } = await axios.get(API_URL, { headers });
    
    if (!data || !data.data || !data.data[0]) {
      console.error("Invalid response format from VJudge");
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
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else {
      console.error("API Error:", error);
    }
    return NextResponse.json({ 
      error: "Failed to update leaderboard",
      details: error.response?.data || error.message,
      status: error.response?.status || 500
    }, { 
      status: error.response?.status || 500 
    });
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
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch hustle data",
      details: error.message 
    }, { status: 500 });
  }
}
