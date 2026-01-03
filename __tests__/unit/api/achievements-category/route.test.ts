import { POST, GET, PUT, DELETE } from "@/app/(default)/api/achievements-category/route";
import AchievementsCategory from "@/models/AchievementsCategory";
import connectMongoDB from "@/lib/dbConnect";
import { cloudinary } from "@/Cloudinary";
import { requireAuth } from "@/lib/requireAuth";
import { Writable } from "stream";

jest.mock("@/lib/dbConnect", () => jest.fn());

jest.mock("@/lib/requireAuth", () => ({
    requireAuth: jest.fn(),
}));

jest.mock("@/models/AchievementsCategory", () => {
    const Model: any = jest.fn();
    Model.findOne = jest.fn();
    Model.find = jest.fn();
    Model.findOneAndUpdate = jest.fn();
    Model.deleteOne = jest.fn();
    return { __esModule: true, default: Model };
});

jest.mock("@/Cloudinary", () => ({
    cloudinary: {
        uploader: {
            upload_stream: jest.fn(),
        },
    },
}));

const authSuccess = () =>
    (requireAuth as jest.Mock).mockResolvedValue({
        user: { id: "user-1" },
        error: null,
    });

const authFailure = () =>
    (requireAuth as jest.Mock).mockResolvedValue({
        user: null,
        error: new Response("Unauthorized", { status: 401 }),
    });

const mockCloudinaryUpload = (url = "https://cloudinary.com/img.jpg") => {
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (_opts, cb) =>
            new Writable({
                write(_chunk, _enc, done) {
                    done();
                },
                final(done) {
                    cb(null, { secure_url: url });
                    done();
                },
            })
    );
};

const createValidFormRequest = (method: string) => {
    const formData = new FormData();
    formData.append("name", "John");
    formData.append("achievements", JSON.stringify(["Hackathon Winner"]));
    formData.append(
        "image",
        new File(["fake"], "image.png", { type: "image/png" })
    );

    return new Request("http://localhost:3000/api/achievements-category", {
        method,
        body: formData,
    });
};

beforeEach(() => {
    jest.resetAllMocks();
    authSuccess();
    (connectMongoDB as jest.Mock).mockResolvedValue(undefined);
});

//POST
describe("POST /api/achievements-category", () => {
    it("creates a category successfully", async () => {
        (AchievementsCategory.findOne as jest.Mock).mockResolvedValue(null);

        const saveMock = jest.fn().mockResolvedValue({ name: "John" });

        (AchievementsCategory as unknown as jest.Mock).mockImplementation(() => ({
            save: saveMock,
        }));

        mockCloudinaryUpload();

        const res = await POST(createValidFormRequest("POST"));
        const body = await res.json();

        expect(res.status).toBe(201);
        expect(body.message).toBe("Achievement Created Successfully");
        expect(saveMock).toHaveBeenCalled();
        expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
    });

    it("returns 401 when authentication fails", async () => {
        authFailure();

        const res = await POST(new Request("http://localhost:3000/api/achievements-category", { method: "POST" }));
        expect(res.status).toBe(401);
        expect(AchievementsCategory.findOne).not.toHaveBeenCalled();
        expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
    });

    it("returns 400 if required fields are missing", async () => {
        const fd = new FormData();
        fd.append("name", "John");

        const res = await POST(
            new Request("http://localhost:3000/api/achievements-category", { method: "POST", body: fd })
        );

        expect(res.status).toBe(400);
    });

    it("returns 409 on duplicate name", async () => {
        (AchievementsCategory.findOne as jest.Mock).mockResolvedValue({ name: "John" });

        const res = await POST(createValidFormRequest("POST"));
        const body = await res.json();

        expect(res.status).toBe(409);
        expect(body.error).toBe("Duplicate Entry");
    });

    it("returns 500 if Cloudinary upload fails", async () => {
        (AchievementsCategory.findOne as jest.Mock).mockResolvedValue(null);

        (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
            (_opts, cb) => cb(new Error("Upload failed"), null)
        );

        const res = await POST(createValidFormRequest("POST"));
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.error).toBe("Image Upload Failed");
    });
});

//GET
describe("GET /api/achievements-category", () => {
    it("returns all categories", async () => {
        (AchievementsCategory.find as jest.Mock).mockResolvedValue([
            { _id: "1", name: "John", achievements: [] },
        ]);

        const res = await GET(
            new Request("http://localhost:3000/api/achievements-category") as any
        );

        const body = await res.json();
        expect(res.status).toBe(200);
        expect(body.data.length).toBe(1);
    });

    it("filters by name", async () => {
        (AchievementsCategory.find as jest.Mock).mockResolvedValue([
            { _id: "1", name: "John" },
        ]);

        const res = await GET(
            new Request("http://localhost:3000/api/achievements-category?name=John") as any
        );

        expect(res.status).toBe(200);
        expect(AchievementsCategory.find).toHaveBeenCalledWith({ name: "John" });
    });

    it("returns 404 if name not found", async () => {
        (AchievementsCategory.find as jest.Mock).mockResolvedValue([]);

        const res = await GET(
            new Request("http://localhost:3000/api/achievements-category?name=Missing") as any
        );

        expect(res.status).toBe(404);
    });

    it("returns 500 on DB failure", async () => {
        (AchievementsCategory.find as jest.Mock).mockRejectedValue(
            new Error("DB down")
        );

        const res = await GET(
            new Request("http://localhost:3000/api/achievements-category") as any
        );

        expect(res.status).toBe(500);
    });
});

//PUT
describe("PUT /api/achievements-category", () => {
    it("returns 400 if name missing", async () => {
        const fd = new FormData();
        fd.append("achievements", JSON.stringify([]));

        const res = await PUT(
            new Request("http://localhost:3000/api/achievements-category", { method: "PUT", body: fd })
        );

        expect(res.status).toBe(400);
    });

    it("returns 404 if category not found", async () => {
        (AchievementsCategory.findOne as jest.Mock).mockResolvedValue(null);

        const fd = new FormData();
        fd.append("name", "user");
        fd.append("achievements", JSON.stringify([]));

        const res = await PUT(
            new Request("http://localhost:3000/api/achievements-category", { method: "PUT", body: fd })
        );

        expect(res.status).toBe(404);
    });

    it("returns 401 when authentication fails", async () => {
        authFailure();

        const res = await PUT(new Request("http://localhost:3000/api/achievements-category", { method: "PUT" }));
        expect(res.status).toBe(401);
        expect(AchievementsCategory.findOne).not.toHaveBeenCalled();
        expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
    });

    it("returns 500 if image upload fails during PUT", async () => {
        (AchievementsCategory.findOne as jest.Mock).mockResolvedValue({ name: "John" });

        (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
            (_opts, cb) => cb(new Error("Upload failed"), null)
        );

        const fd = new FormData();
        fd.append("name", "user");
        fd.append("achievements", JSON.stringify([]));
        fd.append("image", new File(["img"], "img.png"));

        const res = await PUT(
            new Request("http://localhost:3000/api/achievements-category", {
                method: "PUT",
                body: fd,
            })
        );

        expect(res.status).toBe(500);
    });


    it("updates category successfully", async () => {
        (AchievementsCategory.findOne as jest.Mock).mockResolvedValue({ name: "John" });

        (AchievementsCategory.findOneAndUpdate as jest.Mock).mockResolvedValue({
            name: "user",
        });

        const fd = new FormData();
        fd.append("name", "user");
        fd.append("achievements", JSON.stringify(["Updated Achievement"]));

        const res = await PUT(
            new Request("http://localhost:3000/api/achievements-category", { method: "PUT", body: fd })
        );

        expect(res.status).toBe(200);
    });
});

//DELETE
describe("DELETE /api/achievements-category", () => {
    it("returns 400 if name missing", async () => {
        const res = await DELETE(
            new Request("http://localhost:3000/api/achievements-category", { method: "DELETE" }) as any
        );

        expect(res.status).toBe(400);
    });

    it("returns 404 if category not found", async () => {
        (AchievementsCategory.findOne as jest.Mock).mockResolvedValue(null);

        const res = await DELETE(
            new Request("http://localhost/api/achievements-category?name=user", { method: "DELETE" }) as any
        );


        expect(res.status).toBe(404);
    });

    it("returns 401 when authentication fails", async () => {
        authFailure();

        const res = await DELETE(new Request("http://localhost:3000/api/achievements-category", { method: "DELETE" }) as any);
        expect(res.status).toBe(401);
        expect(AchievementsCategory.findOne).not.toHaveBeenCalled();
        expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
    });

    it("deletes category successfully", async () => {
        (AchievementsCategory.findOne as jest.Mock).mockResolvedValue({ name: "John" });

        (AchievementsCategory.deleteOne as jest.Mock).mockResolvedValue({
            deletedCount: 1,
        });

        const res = await DELETE(
            new Request("http://localhost:3000/api/achievements-category?name=user", { method: "DELETE" }) as any
        );

        expect(res.status).toBe(200);
    });

    it("returns 500 if delete fails", async () => {
        (AchievementsCategory.findOne as jest.Mock).mockResolvedValue({ name: "John" });

        (AchievementsCategory.deleteOne as jest.Mock).mockRejectedValue(
            new Error("DB crash")
        );

        const res = await DELETE(
            new Request("http://localhost:3000/api/achievements-category?name=user", { method: "DELETE" }) as any
        );

        expect(res.status).toBe(500);
    });
});
