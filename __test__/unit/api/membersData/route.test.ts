import { GET, POST, PUT, DELETE } from "@/app/(default)/api/membersData/route";
import connectMongoDB from "@/lib/dbConnect";
import Membersmodel from "@/models/Members";
import { cloudinary } from "@/Cloudinary";
import { requireAuth } from "@/lib/requireAuth";


jest.mock("@/lib/dbConnect", () => jest.fn());

jest.mock("@/lib/requireAuth", () => ({
    requireAuth: jest.fn(),
}));

jest.mock("@/models/Members", () => {
    const Model: any = jest.fn();
    Model.find = jest.fn();
    Model.findOne = jest.fn();
    Model.findOneAndUpdate = jest.fn();
    Model.deleteOne = jest.fn();
    Model.prototype.save = jest.fn();
    return { __esModule: true, default: Model };
});

jest.mock("@/Cloudinary", () => ({
    cloudinary: {
        uploader: {
            upload_stream: jest.fn(),
            destroy: jest.fn(),
        },
    },
}));


const mockAuthSuccess = () =>
    (requireAuth as jest.Mock).mockResolvedValue({
        user: { id: "user-1" },
        error: null,
    });

const mockAuthFailure = () =>
    (requireAuth as jest.Mock).mockResolvedValue({
        user: null,
        error: new Response("Unauthorized", { status: 401 }),
    });


const validMongoId = "507f191e810c19729de860ea";

const validMemberPayload = {
    name: "User",
    position: "Current",
    organization: "POINT BLANK",
    additionalInfo: "Technical Lead",
    imageUrl: "https://res.cloudinary.com/demo/pbmembers/avatar.webp",
    linkedInUrl: "https://example.com",
};

const createJSONRequest = (url: string, method: string, body: any = {}) =>
    new Request(url, {
        method,
        body: JSON.stringify(body),
    });


beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => { });
    mockAuthSuccess();
    (connectMongoDB as jest.Mock).mockResolvedValue(undefined);
});

describe("GET /api/membersData", () => {
    it("should return all members successfully", async () => {
        (Membersmodel.find as jest.Mock).mockResolvedValue([
            { id: "1", name: "User", role: "Dev", year: "2025" },
        ]);

        const res = await GET();
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body).toHaveLength(1);
    });

    it("should return 500 when database query fails", async () => {
        (Membersmodel.find as jest.Mock).mockRejectedValue(
            new Error("DB failure")
        );

        const res = await GET();
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.error).toBeDefined();
    });
});

describe("POST /api/membersData", () => {
    it("creates a member successfully", async () => {
        (Membersmodel.prototype.save as jest.Mock).mockResolvedValue({
            _id: "m1",
            ...validMemberPayload,
        });

        const req = createJSONRequest(
            "http://localhost:3000/api/membersData",
            "POST",
            validMemberPayload
        );

        const res = await POST(req);
        const body = await res.json();

        expect(res.status).toBe(201);
        expect(body.savedMember).toBeDefined();
        expect(requireAuth).toHaveBeenCalled();
    });

    it("returns 401 if auth fails", async () => {
        mockAuthFailure();

        const req = createJSONRequest(
            "http://localhost:3000/api/membersData",
            "POST",
            validMemberPayload
        );

        const res = await POST(req);

        expect(res.status).toBe(401);
        expect(Membersmodel.prototype.save).not.toHaveBeenCalled();
    });

    it("returns 400 if name missing", async () => {
        const req = createJSONRequest(
            "http://localhost:3000/api/membersData",
            "POST",
            { role: "Dev" }
        );

        const res = await POST(req);

        expect(res.status).toBe(400);
    });

    it("returns 500 if save crashes", async () => {
        (Membersmodel.prototype.save as jest.Mock).mockRejectedValue(
            new Error("Save failed")
        );

        const req = createJSONRequest(
            "http://localhost:3000/api/membersData",
            "POST",
            validMemberPayload
        );

        const res = await POST(req);

        expect(res.status).toBe(500);
    });
});

describe("PUT /api/membersData", () => {
    it("updates a member successfully", async () => {
        const existing = { _id: validMongoId, imageUrl: validMongoId };

        (Membersmodel.findOne as jest.Mock).mockResolvedValue(existing);

        (Membersmodel.findOneAndUpdate as jest.Mock).mockResolvedValue({
            _id: validMongoId,
            name: "Updated Name",
            role: "Dev",
            year: "2026",
        });

        const req = createJSONRequest(
            `http://localhost:3000/api/membersData?id=${validMongoId}`,
            "PUT",
            {
                id: validMongoId,
                name: "Updated Name",
            }
        );

        const res = await PUT(req);

        expect(res.status).toBe(200);
        expect(Membersmodel.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    it("returns 400 if id missing", async () => {
        const req = createJSONRequest(
            "http://localhost:3000/api/membersData",
            "PUT",
            { name: "X" }
        );

        const res = await PUT(req);

        expect(res.status).toBe(400);
    });

    it("returns 404 if member not found", async () => {
        (Membersmodel.findOne as jest.Mock).mockResolvedValue(null);

        const req = createJSONRequest(
            `http://localhost:3000/api/membersData?id=${validMongoId}`,
            "PUT",
            {
                id: validMongoId,
                name: "Updated Name"
            }
        );

        const res = await PUT(req);

        expect(res.status).toBe(404);
    });

    it("deletes old image when imageUrl changed", async () => {
        (Membersmodel.findOne as jest.Mock).mockResolvedValue({
            _id: validMongoId,
            imageUrl: "https://res.cloudinary.com/demo/pbmembers/old.webp",
        });

        (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
            result: "ok",
        });

        const req = createJSONRequest(
            `http://localhost:3000/api/membersData?id=${validMongoId}`,
            "PUT",
            {
                id: validMongoId,
                name: "User X",
                imageUrl: "https://res.cloudinary.com/demo/pbmembers/new.webp",
            }
        );

        await PUT(req);

        expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
    });

    it("returns 500 if update crashes", async () => {
        (Membersmodel.findOne as jest.Mock).mockResolvedValue({
            _id: validMongoId,
        });

        (Membersmodel.findOneAndUpdate as jest.Mock).mockRejectedValue(
            new Error("DB crash")
        );

        const req = createJSONRequest(
            `http://localhost:3000/api/membersData?id=${validMongoId}`,
            "PUT",
            {
                id: validMongoId,
                name: "Updated Name",
            }
        );

        const res = await PUT(req);

        expect(res.status).toBe(500);
    });
});

describe("DELETE /api/membersData", () => {
    it("deletes member successfully with image cleanup", async () => {
        (Membersmodel.findOne as jest.Mock).mockResolvedValue({
            _id: validMongoId,
            name: "user",
            imageUrl: "https://res.cloudinary.com/demo/pbmembers/avatar.webp",
        });

        (Membersmodel.deleteOne as jest.Mock).mockResolvedValue({
            deletedCount: 1,
        });

        (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
            result: "ok",
        });

        const req = createJSONRequest(
            `http://localhost:3000/api/membersData`,
            "DELETE",
            { id: validMongoId }
        );

        const res = await DELETE(req);

        expect(res.status).toBe(200);
        expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
    });

    it("returns 401 when auth fails", async () => {
        mockAuthFailure();

        const req = createJSONRequest(
            "http://localhost:3000/api/membersData",
            "DELETE",
            { id: validMongoId }
        );

        const res = await DELETE(req);

        expect(res.status).toBe(401);
    });

    it("returns 400 if id missing", async () => {
        const req = createJSONRequest(
            "http://localhost:3000/api/membersData",
            "DELETE",
            {}
        );

        const res = await DELETE(req);

        expect(res.status).toBe(400);
    });

    it("returns 404 if member not found", async () => {
        (Membersmodel.findOne as jest.Mock).mockResolvedValue(null);

        const req = createJSONRequest(
            "http://localhost:3000/api/membersData",
            "DELETE",
            { id: validMongoId }
        );

        const res = await DELETE(req);

        expect(res.status).toBe(404);
    });

    it("succeeds even if cloudinary delete fails", async () => {
        (Membersmodel.findOne as jest.Mock).mockResolvedValue({
            _id: validMongoId,
            name: "User",
            imageUrl: "https://res.cloudinary.com/demo/pbmembers/avatar.webp",
        });

        (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(
            new Error("Cloudinary down")
        );

        const req = createJSONRequest(
            "http://localhost:3000/api/membersData",
            "DELETE",
            { id: validMongoId }
        );

        const res = await DELETE(req);

        expect(res.status).toBe(200);
    });
});
