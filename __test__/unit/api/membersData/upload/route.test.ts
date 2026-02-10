import { POST } from "@/app/(default)/api/membersData/upload/route";
import { cloudinary } from "@/Cloudinary";
import { requireAuth } from "@/lib/requireAuth";

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
    user: { id: "test-user-id" },
    error: null,
  });

const mockAuthFailure = () =>
  (requireAuth as jest.Mock).mockResolvedValue({
    user: null,
    error: new Response("Unauthorized", { status: 401 }),
  });

function createValidMultipartRequest(
  name = "profile-image",
  existingUrl: string | null = null
) {
  const formData = new FormData();
  const file = new File(["dummy"], "test.png", { type: "image/png" });

  formData.append("file", file);
  formData.append("name", name);

  if (existingUrl) {
    formData.append("existingUrl", existingUrl);
  }

  return new Request("http://localhost:3000/api/membersData/upload", {
    method: "POST",
    body: formData,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
  mockAuthSuccess();
});

describe("POST /api/membersData/upload", () => {

  it("should call requireAuth before processing", async () => {
    const req = createValidMultipartRequest();
    await POST(req);

    expect(requireAuth).toHaveBeenCalledTimes(1);
  });

  it("should upload image successfully to Cloudinary", async () => {
    const url = "https://res.cloudinary.com/test/pbmembers/new.webp";

    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
      (_opts: any, cb: any) => {
        cb(null, { secure_url: url, public_id: "img-1" });
      }
    );

    const req = createValidMultipartRequest();
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.imageUrl).toBe(url);

    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledTimes(1);
  });

  it("should return 400 when required multipart fields missing", async () => {
    const req = new Request("http://localhost:3000/api/membersData/upload", {
      method: "POST",
      body: new FormData(),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("should return 401 when authentication fails", async () => {
    mockAuthFailure();

    const req = createValidMultipartRequest();
    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
  });

  it("should attempt Cloudinary deletion when existingUrl provided", async () => {
    (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
      result: "ok",
    });

    const existing = "https://res.cloudinary.com/test/pbmembers/old.webp";

    const req = createValidMultipartRequest("profile-image", existing);
    await POST(req);

    expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
  });

  it("should return 500 when Cloudinary upload fails", async () => {
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
      (_opts: any, cb: any) => {
        cb(new Error("Cloudinary Upload Failed"), null);
      }
    );

    const req = createValidMultipartRequest();
    const res = await POST(req);

    expect(res.status).toBe(500);
  });

});
