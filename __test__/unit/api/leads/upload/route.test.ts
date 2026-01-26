import { POST } from "@/app/(default)/api/leads/upload/route";
import { requireAuth } from "@/lib/requireAuth";
import { cloudinary } from "@/Cloudinary";
import { Writable } from "stream";

jest.mock("@/lib/requireAuth", () => ({
  requireAuth: jest.fn(),
}));

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
    user: { id: "user-id" },
    error: null,
  });

const mockAuthFailure = () =>
  (requireAuth as jest.Mock).mockResolvedValue({
    user: null,
    error: new Response("Unauthorized", { status: 401 }),
  });


const mockCloudinaryUpload = (url = "https://res.cloudinary.com/test/leads/img.jpg") => {
  (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
    (_options: any, callback: any) =>
      new Writable({
        write(_chunk, _encoding, done) {
          done();
        },
        final(done) {
          callback(null, {
            secure_url: url,
            public_id: "public-id",
          });
          done();
        },
      })
  );
};

const createUploadRequest = ({
  fileContent = "image content",
  fileName = "avatar.png",
  fileType = "image/png",
  name = "image",
  existingUrl = null as string | null,
} = {}) => {
  const formData = new FormData();

  const file = new File([fileContent], fileName, { type: fileType });

  formData.append("file", file);
  formData.append("name", name);

  if (existingUrl) {
    formData.append("existingUrl", existingUrl);
  }

  return new Request("http://localhost:3000/api/leads/upload", {
    method: "POST",
    body: formData,
  });
};

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
  mockAuthSuccess();
});

describe("POST /api/leads/upload", () => {

  it("should upload image successfully and return secure URL", async () => {
    mockCloudinaryUpload();

    const req = createUploadRequest();
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.imageUrl).toBeDefined();
    expect(body.imageUrl).toContain("res.cloudinary");

    expect(requireAuth).toHaveBeenCalledTimes(1);
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledTimes(1);
  });

  it("should return 400 when file is missing", async () => {
    const formData = new FormData();
    formData.append("name", "only-name");

    const req = new Request("http://localhost/api/leads/upload", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.message).toBe("Bad Request");
  });

  it("should return 400 when name is missing", async () => {
    const req = createUploadRequest({ name: "" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.message).toBe("Bad Request");
  });

  it("should return 401 when authentication fails", async () => {
    mockAuthFailure();

    const req = createUploadRequest();
    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
  });

  it("should handle Cloudinary deletion failure gracefully", async () => {
    (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(
      new Error("Cloudinary deletion failed")
    );

    mockCloudinaryUpload();

    const req = createUploadRequest({ existingUrl: "any.png" });

    const res = await POST(req);

    expect(res.status).toBe(200);
  });

  it("should return 500 when Cloudinary upload fails", async () => {
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
      (_opts: any, cb: any) => {
        cb(new Error("Cloudinary is down"), null);
      }
    );

    const req = createUploadRequest();
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.message).toContain("Cloudinary Upload Failed");
  });

  it("should continue and return 200 even if non-critical parsing error occurs in sub flow", async () => {
    mockCloudinaryUpload();

    const req = createUploadRequest();
    const res = await POST(req);

    expect(res.status).toBe(200);
  });

});
