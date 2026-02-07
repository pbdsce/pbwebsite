import { PATCH, DELETE } from "@/app/(default)/api/credits/[id]/route";
import Credit from "@/models/Credit";
import connectMongoDB from "@/lib/dbConnect";

jest.mock("@/lib/dbConnect", () => jest.fn());

jest.mock("@/models/Credit", () => {
    const Model: any = jest.fn();
    Model.findByIdAndUpdate = jest.fn();
    Model.findByIdAndDelete = jest.fn();
    return { __esModule: true, default: Model };
});

beforeEach(() => {
    jest.clearAllMocks();
    (connectMongoDB as jest.Mock).mockResolvedValue(undefined);
});


describe("PATCH /api/credits/:id", () => {
    it("updates credit successfully", async () => {
        (Credit.findByIdAndUpdate as jest.Mock).mockResolvedValue({
            _id: "123",
            name: "Updated Name",
        });

        const req = new Request(
            "http://localhost:3000/api/credits/123",
            {
                method: "PATCH",
                body: JSON.stringify({ name: "Updated Name" }),
            }
        );

        const res = await PATCH(req, { params: { id: "123" } });
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.updatedCredit.name).toBe("Updated Name");
    });

    it("returns 404 when credit does not exist", async () => {
        (Credit.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

        const req = new Request(
            "http://localhost:3000/api/credits/123",
            {
                method: "PATCH",
                body: JSON.stringify({ name: "User" }),
            }
        );

        const res = await PATCH(req, { params: { id: "123" } });
        const body = await res.json();

        expect(res.status).toBe(404);
        expect(body.error).toBe("Credit not found");
    });

    it("returns 500 when database update fails", async () => {
        (Credit.findByIdAndUpdate as jest.Mock).mockRejectedValue(
            new Error("Database Update Failed")
        );

        const req = new Request(
            "http://localhost:3000/api/credits/123",
            {
                method: "PATCH",
                body: JSON.stringify({ name: "User" }),
            }
        );

        const res = await PATCH(req, { params: { id: "123" } });
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.error).toBeDefined();
    });
});

describe("DELETE /api/credits/:id", () => {
    it("deletes credit successfully", async () => {
        (Credit.findByIdAndDelete as jest.Mock).mockResolvedValue({
            _id: "123",
        });

        const req = new Request(
            "http://localhost:3000/api/credits/123",
            { method: "DELETE" }
        );

        const res = await DELETE(req as any, { params: { id: "123" } });
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toBe("Contributor deleted successfully");
    });

    it("returns 404 when credit does not exist", async () => {
        (Credit.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        const req = new Request(
            "http://localhost:3000/api/credits/123",
            { method: "DELETE" }
        );

        const res = await DELETE(req as any, { params: { id: "123" } });
        const body = await res.json();

        expect(res.status).toBe(404);
        expect(body.error).toBe("Credit not found");
    });

    it("returns 500 when database delete fails", async () => {
        (Credit.findByIdAndDelete as jest.Mock).mockRejectedValue(
            new Error("Database Delete Failed")
        );

        const req = new Request(
            "http://localhost:3000/api/credits/123",
            { method: "DELETE" }
        );

        const res = await DELETE(req as any, { params: { id: "123" } });
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.error).toBeDefined();
    });
});
