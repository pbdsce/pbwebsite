import { POST, GET } from "@/app/(default)/api/hustle/route";
import axios from "axios";
import connectMongoDB from "@/lib/dbConnect";
import { LatestModel, LeaderboardModel } from "@/models/PbHustel";
import { lead } from "@/app/(default)/api/hustle/leaderboard";

jest.mock("axios");
jest.mock("@/lib/dbConnect", () => jest.fn());

jest.mock("@/models/PbHustel", () => {
    const Latest: any = jest.fn();
    Latest.findOneAndUpdate = jest.fn();
    Latest.findOne = jest.fn();

    const Leaderboard: any = jest.fn();
    Leaderboard.findOne = jest.fn();
    Leaderboard.findOneAndUpdate = jest.fn();
    Leaderboard.find = jest.fn();

    return {
        __esModule: true,
        LatestModel: Latest,
        LeaderboardModel: Leaderboard,
    };
});

jest.mock("@/app/(default)/api/hustle/leaderboard", () => ({
    lead: jest.fn(),
}));

beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => { });
});

const createPostRequest = () =>
    new Request("http://localhost:3000/api/hustle", {
        method: "POST",
    });

const createGetRequest = () =>
    new Request("http://localhost:3000/api/hustle", {
        method: "GET",
    });

describe("POST /api/hustle", () => {

    it("should call MongoDB connection", async () => {
        const req = createPostRequest();
        await POST();

        expect(connectMongoDB).toHaveBeenCalled();
    });

    it("should return 400 when VJudge format is invalid", async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({
            data: { data: [] },
        });

        const res = await POST();
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body).toEqual({
            error: "Invalid response from VJudge",
            details: expect.any(String),
        });
    });

    it("should return up-to-date message if contest code matches", async () => {

        (axios.get as jest.Mock)
            .mockResolvedValueOnce({
                data: { data: [["123"]] },
            })
            .mockResolvedValueOnce({
                data: [],   
            });

        (LeaderboardModel.findOne as jest.Mock).mockResolvedValueOnce({
            lastContestCode: "123",
            rankings: [],
        });

        const res = await POST();
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.message).toBe("Leaderboard is already up-to-date.");
    });

    it("should update leaderboard and return 200 on success", async () => {

        (axios.get as jest.Mock).mockResolvedValueOnce({
            data: { data: [["123"]] },
        });

        (axios.get as jest.Mock).mockResolvedValueOnce({
            data: [
                { nam: "User 1", disp: "india", tot: 10 },
                { nam: "User 2", disp: "india", tot: 20 },
            ],
        });

        (LeaderboardModel.findOne as jest.Mock).mockResolvedValue({
            lastContestCode: "100",
            rankings: [],
        });

        (lead as jest.Mock).mockReturnValue([
            { nam: "User 1", disp: "india", tot: 10 },
            { nam: "User 2", disp: "india", tot: 20 },
        ]);

        (LatestModel.findOneAndUpdate as jest.Mock).mockResolvedValue({});
        (LeaderboardModel.findOneAndUpdate as jest.Mock).mockResolvedValue({});

        const res = await POST();
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.message).toBe("Leaderboard updated successfully");

        expect(LatestModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
        expect(LeaderboardModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    it("should return 500 when axios throws error", async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(
            new Error("network failure")
        );

        const res = await POST();
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.error).toBe("Failed to update leaderboard");
    });

});

describe("GET /api/hustle", () => {

    it("should fetch data successfully from database", async () => {

        (LatestModel.findOne as jest.Mock).mockResolvedValueOnce({
            results: [{ rank: 1, name: "User", score: 50 }],
        });

        (LeaderboardModel.findOne as jest.Mock).mockResolvedValueOnce({
            rankings: [{ name: "User", score: 100, consistency: 5 }],
        });

        const res = await GET();
        const body = await res.json();

        expect(res.status).toBe(200);

        expect(body).toEqual({
            message: "Fetched hustle data successfully",
            data: {
                latest: expect.any(Object),
                leaderboard: expect.any(Object),
            },
        });

        expect(LatestModel.findOne).toHaveBeenCalled();
        expect(LeaderboardModel.findOne).toHaveBeenCalled();
    });

    it("should return 500 on DB fetch failure", async () => {
        (LatestModel.findOne as jest.Mock).mockRejectedValueOnce(
            new Error("DB failure")
        );

        const req = createGetRequest();
        const res = await GET();

        expect(res.status).toBe(500);
    });

});
