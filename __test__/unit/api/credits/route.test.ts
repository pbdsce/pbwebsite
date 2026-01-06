import { GET } from "@/app/(default)/api/credits/route";
import Credit from "@/models/Credit";
import connectMongoDB from "@/lib/dbConnect";

jest.mock("@/lib/dbConnect", () => jest.fn());

jest.mock("@/models/Credit", () => {
    const Model: any = jest.fn();
    Model.find = jest.fn();
    return { __esModule: true, default: Model };
});

beforeEach(() => {
    jest.clearAllMocks();
    (connectMongoDB as jest.Mock).mockResolvedValue(undefined);
});

describe("GET /api/credits", () => {
    it("returns all credits successfully", async () => {
        const mockCredits = [
            {
                _id: "1",
                userId: 1,
                name: "User 1",
                githubUrl: "https://github.com/user1",
                imageUrl: "https://image.com/user1.png",
            },
            {
                _id: "2",
                userId: 2,
                name: "User 2",
                githubUrl: "https://github.com/user2",
                imageUrl: "https://image.com/user2.png",
            },
        ];

        (Credit.find as jest.Mock).mockResolvedValue(mockCredits);

        const req = new Request("http://localhost:3000/api/credits", {
            method: "GET",
        });

        const res = await GET();
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.credits).toHaveLength(2);
        expect(body.credits).toEqual(mockCredits);
    });

    it("returns empty array when no credits exist", async () => {
        (Credit.find as jest.Mock).mockResolvedValue([]);

        const res = await GET();
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.credits).toEqual([]);
    });

    it("returns 500 when database query fails", async () => {
        (Credit.find as jest.Mock).mockRejectedValue(
            new Error("Database failure")
        );

        const res = await GET();
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.success).toBe(false);
        expect(body.error).toBeDefined();
    });
});
