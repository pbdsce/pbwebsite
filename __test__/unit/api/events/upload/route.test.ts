import { POST } from "@/app/(default)/api/events/upload/route";
import connectMongoDB from "@/lib/dbConnect";
import { cloudinary } from "@/Cloudinary";
import { requireAuth } from "@/lib/requireAuth";
import { Writable } from "stream";


jest.mock("@/lib/dbConnect", () => jest.fn());

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

const mockCloudinaryUpload = (url = "https://res.cloudinary.com/test/events/img.jpg") => {
  (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
    (_opts: any, cb: any) =>
      new Writable({
        write(_chunk, _enc, done) {
          done();
        },
        final(done) {
          cb(null, { secure_url: url, public_id: "img-1" });
          done();
        },
      })
  );
};

const createValidRequest = ({
  name = "event",
  file = new File(["image"], "test.png", { type: "image/png" }),
  existingUrl = null as string | null,
} = {}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("file", file);

  if (existingUrl) {
    formData.append("existingUrl", existingUrl);
  }

  return new Request("http://localhost:3000/api/events/upload", {
    method: "POST",
    body: formData,
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
  authSuccess();
  (connectMongoDB as jest.Mock).mockResolvedValue(undefined);
});

describe("POST /api/upload", () => {
  it("uploads image successfully to Cloudinary", async () => {
    mockCloudinaryUpload();

    const req = createValidRequest();
    const res = await POST(req);

    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.imageUrl).toBeDefined();

    expect(requireAuth).toHaveBeenCalled();
  });

  it("returns 401 when authentication fails", async () => {
    authFailure();

    const req = createValidRequest();

    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    const invalidFormData = new FormData();
    invalidFormData.append("name", "");

    const req = new Request("http://localhost:3000/api/events/upload", {
      method: "POST",
      body: invalidFormData,
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
  });

  it("deletes existing image when existingUrl is provided", async () => {
    const existing = "https://res.cloudinary.com/test/events/old.png";

    mockCloudinaryUpload();

    const req = createValidRequest({ existingUrl: existing });
    const res = await POST(req);

    expect(cloudinary.uploader.destroy).toHaveBeenCalled();
  });

  it("returns 500 when Cloudinary upload fails", async () => {
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
      (_opts: any, cb: any) => {
        cb(new Error("Cloudinary connection lost"), null);
      }
    );

    const req = createValidRequest();
    const res = await POST(req);

    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.message).toContain("Cloudinary Upload Failed");
  });

  it("handles Cloudinary deletion failure gracefully", async () => {
    (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(
      new Error("Cloudinary down")
    );

    mockCloudinaryUpload();

    const req = createValidRequest({ existingUrl: "url.png" });

    const res = await POST(req);

    expect(res.status).toBe(200);
  });
});
