import { POST, GET, PUT, DELETE } from "@/app/(default)/api/achievements/route";
import Achievementmodel from "@/models/Achievements";
import connectMongoDB from "@/lib/dbConnect";
import { cloudinary } from "@/Cloudinary";
import { requireAuth } from "@/lib/requireAuth";
import { Writable } from "stream";

jest.mock("@/lib/dbConnect", () => jest.fn());

jest.mock("@/lib/requireAuth", () => ({
    requireAuth: jest.fn(),
}));

jest.mock("@/models/Achievements", () => {
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
            destroy: jest.fn(),
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

const mockCloudinaryUpload = (url = "https://cloudinary.com/image.jpg") => {
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

const createValidRequest = () => {
    const formData = new FormData();
    formData.append("name", "test");
    formData.append("email", "test@test.com");
    formData.append("batch", "2025");
    formData.append("achievements", JSON.stringify(["Hackathon Winner"]));
    formData.append(
        "image",
        new File(["fake-image"], "image.png", { type: "image/png" })
    );

    return new Request("http://localhost:3000/api/achievements", {
        method: "POST",
        body: formData,
    });
};

beforeEach(() => {
    jest.resetAllMocks();
    authSuccess();
    (connectMongoDB as jest.Mock).mockResolvedValue(undefined);
});

//POST
describe("POST /api/achievements", () => {
    it("creates an achievement successfully", async () => {
        (Achievementmodel.findOne as jest.Mock).mockResolvedValue(null);

        const saveMock = jest.fn().mockResolvedValue({
            email: "test@test.com",
        });

        (Achievementmodel as unknown as jest.Mock).mockImplementation(() => ({
            save: saveMock,
        }));

        mockCloudinaryUpload();

        const req = createValidRequest();
        const res = await POST(req);
        const body = await res.json();

        expect(res.status).toBe(201);
        expect(body.message).toBe("Achievement Created Successfully");

        expect(requireAuth).toHaveBeenCalled();
        expect(connectMongoDB).toHaveBeenCalled();
        expect(Achievementmodel.findOne).toHaveBeenCalledWith({
            email: "test@test.com",
        });
        expect(saveMock).toHaveBeenCalled();
        expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
    });

    it("returns 401 if authentication fails", async () => {
        authFailure();

        const req = new Request("http://localhost:3000/api/achievements", {
            method: "POST",
        });

        const res = await POST(req);

        expect(res.status).toBe(401);
        expect(Achievementmodel.findOne).not.toHaveBeenCalled();
        expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
    });

    it("returns 400 if required fields are missing", async () => {
        const formData = new FormData();
        formData.append("email", "user@test.com");

        const req = new Request("http://localhost:3000/api/achievements", {
            method: "POST",
            body: formData,
        });

        const res = await POST(req);

        expect(res.status).toBe(400);
        expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
    });

    it("returns 409 when duplicate email exists", async () => {
        (Achievementmodel.findOne as jest.Mock).mockResolvedValue({
            email: "test@test.com",
        });

        const req = createValidRequest();
        const res = await POST(req);
        const body = await res.json();

        expect(res.status).toBe(409);
        expect(body.error).toBe("Duplicate Entry");

        expect(Achievementmodel.findOne).toHaveBeenCalledWith({
            email: "test@test.com",
        });
    });

    it("returns 500 if Cloudinary upload fails", async () => {
        (Achievementmodel.findOne as jest.Mock).mockResolvedValue(null);
        (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
            (_opts, cb) => {
                cb(new Error("Cloudinary connection lost"), null);
            }
        );
        const req = createValidRequest();
        const res = await POST(req);
        const body = await res.json();
        expect(res.status).toBe(500);
        expect(body.error).toBe("Image Upload Failed");
    });
})


//GET
describe("GET /api/achievements", () => {
    it("returns all achievements when no email query is provided", async () => {
        (Achievementmodel.find as jest.Mock).mockResolvedValue([
            {
                _id: "1",
                name: "user",
                email: "user@test.com",
                achievements: ["Hackathon Winner"],
            },
        ]);

        const req = new Request("http://localhost:3000/api/achievements", {
            method: "GET",
        });

        const res = await GET(req as any);
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.data).toHaveLength(1);
        expect(Achievementmodel.find).toHaveBeenCalled();
        expect(connectMongoDB).toHaveBeenCalled();
    });

    it("returns achievements filtered by email when email query is present", async () => {
        (Achievementmodel.find as jest.Mock).mockResolvedValue([
            {
                _id: "1",
                email: "user@test.com",
            },
        ]);

        const req = new Request(
            "http://localhost:3000/api/achievements?email=user@test.com",
            { method: "GET" }
        );

        const res = await GET(req as any);
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.data).toHaveLength(1);
        expect(Achievementmodel.find).toHaveBeenCalledWith({
            email: "user@test.com",
        });
    });

    it("returns 404 when email is provided but no member is found", async () => {
        (Achievementmodel.find as jest.Mock).mockResolvedValue([]);

        const req = new Request(
            "http://localhost:3000/api/achievements?email=missing@test.com",
            { method: "GET" }
        );

        const res = await GET(req as any);
        const body = await res.json();

        expect(res.status).toBe(404);
        expect(body.error).toBe("Not Found");
    });

    it("returns 500 when database query fails", async () => {
        (Achievementmodel.find as jest.Mock).mockRejectedValue(
            new Error("DB failure")
        );

        const req = new Request("http://localhost:3000/api/achievements", {
            method: "GET",
        });

        const res = await GET(req as any);
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.error).toBe("Database Query Failed");
    });
});

//PUT
describe("PUT /api/achievements", () => {
    it("returns 401 if authentication fails", async () => {
        authFailure();

        const req = new Request("http://localhost:3000/api/achievements", {
            method: "PUT",
        });

        const res = await PUT(req);

        expect(res.status).toBe(401);
        expect(Achievementmodel.findOne).not.toHaveBeenCalled();
        expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
    });

    it("returns 400 if email is missing", async () => {
        const formData = new FormData();
        formData.append("achievements", JSON.stringify(["Updated"]));

        const req = new Request("http://localhost:3000/api/achievements", {
            method: "PUT",
            body: formData,
        });

        const res = await PUT(req);
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.error).toBe("Validation Failed");
    });

    it("returns 404 if member does not exist", async () => {
        (Achievementmodel.findOne as jest.Mock).mockResolvedValue(null);

        const formData = new FormData();
        formData.append("email", "user@test.com");
        formData.append("achievements", JSON.stringify(["Updated"]));

        const req = new Request("http://localhost:3000/api/achievements", {
            method: "PUT",
            body: formData,
        });

        const res = await PUT(req);

        expect(res.status).toBe(404);
        expect(Achievementmodel.findOne).toHaveBeenCalledWith({
            email: "user@test.com",
        });
    });

    it("updates achievements successfully (no image)", async () => {
        (Achievementmodel.findOne as jest.Mock).mockResolvedValue({
            email: "user@test.com",
        });

        (Achievementmodel.findOneAndUpdate as jest.Mock).mockResolvedValue({
            email: "user@test.com",
            achievements: ["Updated"],
        });

        const formData = new FormData();
        formData.append("email", "user@test.com");
        formData.append("achievements", JSON.stringify(["Updated Achievement"]));
        formData.append("name", "Updated Name");

        const req = new Request("http://localhost:3000/api/achievements", {
            method: "PUT",
            body: formData,
        });

        const res = await PUT(req);
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.message).toBe("Member Updated Successfully");

        expect(Achievementmodel.findOneAndUpdate).toHaveBeenCalledWith(
            { email: "user@test.com" },
            {
                $set: expect.objectContaining({
                    achievements: ["Updated Achievement"],
                    name: "Updated Name",
                }),
            },
            { new: true, runValidators: false }
        );
    });


    it("uploads image and updates member", async () => {
        (Achievementmodel.findOne as jest.Mock).mockResolvedValue({
            email: "user@test.com",
        });

        (Achievementmodel.findOneAndUpdate as jest.Mock).mockResolvedValue({
            email: "user@test.com",
            imageUrl: "https://cloudinary.com/new.jpg",
        });

        mockCloudinaryUpload("https://cloudinary.com/new.jpg");

        const formData = new FormData();
        formData.append("email", "user@test.com");
        formData.append("achievements", JSON.stringify([]));
        formData.append(
            "image",
            new File(["img"], "img.png", { type: "image/png" })
        );

        const req = new Request("http://localhost:3000/api/achievements", {
            method: "PUT",
            body: formData,
        });

        const res = await PUT(req);

        expect(res.status).toBe(200);
        expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
    });
    it("returns 500 if database update fails", async () => {
        (Achievementmodel.findOne as jest.Mock).mockResolvedValue({
            email: "user@test.com",
        });

        (Achievementmodel.findOneAndUpdate as jest.Mock).mockRejectedValue(
            new Error("DB crash")
        );

        const formData = new FormData();
        formData.append("email", "user@test.com");
        formData.append("achievements", JSON.stringify(["Updated"]));

        const req = new Request("http://localhost:3000/api/achievements", {
            method: "PUT",
            body: formData,
        });

        const res = await PUT(req);
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.error).toBe("Database Update Failed");
    });

    it("returns 500 if Cloudinary upload fails", async () => {
        (Achievementmodel.findOne as jest.Mock).mockResolvedValue({
            email: "user@test.com",
        });

        (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
            (_opts, cb) => cb(new Error("Upload failed"), null)
        );

        const formData = new FormData();
        formData.append("email", "user@test.com");
        formData.append("achievements", JSON.stringify([]));
        formData.append(
            "image",
            new File(["img"], "img.png", { type: "image/png" })
        );

        const req = new Request("http://localhost:3000/api/achievements", {
            method: "PUT",
            body: formData,
        });

        const res = await PUT(req);
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.error).toBe("Image Upload Failed");
    });
});

//DELETE
describe("DELETE /api/achievements", () => {
    it("returns 401 if authentication fails", async () => {
        authFailure();

        const req = new Request(
            "http://localhost:3000/api/achievements?email=x@test.com",
            { method: "DELETE" }
        );

        const res = await DELETE(req as any);

        expect(res.status).toBe(401);
        expect(Achievementmodel.findOne).not.toHaveBeenCalled();
    });

    it("returns 400 if email query param is missing", async () => {
        const req = new Request(
            "http://localhost:3000/api/achievements",
            { method: "DELETE" }
        );

        const res = await DELETE(req as any);
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.error).toBe("Validation Failed");
    });

    it("returns 404 if member does not exist", async () => {
        (Achievementmodel.findOne as jest.Mock).mockResolvedValue(null);

        const req = new Request(
            "http://localhost:3000/api/achievements?email=missing@test.com",
            { method: "DELETE" }
        );

        const res = await DELETE(req as any);
        const body = await res.json();

        expect(res.status).toBe(404);
        expect(body.error).toBe("Not Found");

        expect(Achievementmodel.findOne).toHaveBeenCalledWith({
            email: "missing@test.com",
        });
    });

    it("deletes member successfully (with image)", async () => {
        (Achievementmodel.findOne as jest.Mock).mockResolvedValue({
            email: "user@test.com",
            imageUrl: "https://cloudinary.com/achievements/user.jpg",
        });

        (Achievementmodel.deleteOne as jest.Mock).mockResolvedValue({
            deletedCount: 1,
        });

        (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({ result: "ok" });

        const req = new Request(
            "http://localhost:3000/api/achievements?email=user@test.com",
            { method: "DELETE" }
        );

        const res = await DELETE(req as any);
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.message).toBe("Member Deleted Successfully");
        expect(body.email).toBe("user@test.com");

        expect(Achievementmodel.deleteOne).toHaveBeenCalledWith({
            email: "user@test.com",
        });

        expect(cloudinary.uploader.destroy).toHaveBeenCalled();
    });

    it("deletes member successfully even if Cloudinary delete fails", async () => {
        (Achievementmodel.findOne as jest.Mock).mockResolvedValue({
            email: "user@test.com",
            imageUrl: "https://cloudinary.com/achievements/x.jpg",
        });

        (Achievementmodel.deleteOne as jest.Mock).mockResolvedValue({
            deletedCount: 1,
        });

        (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(
            new Error("Cloudinary down")
        );

        const req = new Request(
            "http://localhost:3000/api/achievements?email=x@test.com",
            { method: "DELETE" }
        );

        const res = await DELETE(req as any);

        expect(res.status).toBe(200);
    });

    it("returns 500 if database delete fails", async () => {
        (Achievementmodel.findOne as jest.Mock).mockResolvedValue({
            email: "user@test.com",
        });

        (Achievementmodel.deleteOne as jest.Mock).mockRejectedValue(
            new Error("DB crash")
        );

        const req = new Request(
            "http://localhost:3000/api/achievements?email=x@test.com",
            { method: "DELETE" }
        );

        const res = await DELETE(req as any);
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.error).toBe("Database Delete Failed");
    });

    it("returns 500 if deleteOne returns deletedCount = 0", async () => {
        (Achievementmodel.findOne as jest.Mock).mockResolvedValue({
            email: "user@test.com",
        });

        (Achievementmodel.deleteOne as jest.Mock).mockResolvedValue({
            deletedCount: 0,
        });

        const req = new Request(
            "http://localhost:3000/api/achievements?email=x@test.com",
            { method: "DELETE" }
        );

        const res = await DELETE(req as any);
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.error).toBe("Deletion Failed");
    });
});