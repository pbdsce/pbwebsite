import { GET, POST, PUT, DELETE } from "@/app/(default)/api/leads/route";
import connectMongoDB from "@/lib/dbConnect";
import Leadsmodel from "@/models/Leads";
import { cloudinary } from "@/Cloudinary";
import { requireAuth } from "@/lib/requireAuth";

jest.mock("@/lib/dbConnect", () => jest.fn());

jest.mock("@/lib/requireAuth", () => ({
  requireAuth: jest.fn(),
}));

jest.mock("@/models/Leads", () => {
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

const validLeadPayload = {
  name: "Valid Lead",
  position: "Current",
  organization: "POINT BLANK",
  additionalInfo: "Experienced technical lead and coordinator",
  imageUrl: "https://res.cloudinary.com/demo/leads/img-1.jpg",
  registrationLink: "https://example.com",
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
  mockAuthSuccess();
  (connectMongoDB as jest.Mock).mockResolvedValue(undefined);
});


describe("GET /api/leads", () => {
  it("fetches and separates current and alumni leads", async () => {
    (Leadsmodel.find as jest.Mock).mockResolvedValue([
      { ...validLeadPayload },
      { ...validLeadPayload, position: "Alumni" },
    ]);

    const req = new Request("http://localhost:3000/api/leads", {
      method: "GET",
    });

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.currentLeads).toHaveLength(1);
    expect(body.alumniLeads).toHaveLength(1);

    expect(connectMongoDB).toHaveBeenCalled();
    expect(Leadsmodel.find).toHaveBeenCalled();
  });

  it("returns 500 when DB retrieval fails", async () => {
    (Leadsmodel.find as jest.Mock).mockRejectedValue(
      new Error("DB retrieval failure")
    );

    const req = new Request("http://localhost:3000/api/leads", {
      method: "GET",
    });

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBeDefined();
  });
});

describe("POST /api/leads", () => {
  it("creates a new lead successfully", async () => {
    (Leadsmodel.prototype.save as jest.Mock).mockResolvedValue({
      _id: "mongo-objectid-1",
      ...validLeadPayload,
    });

    const req = new Request("http://localhost:3000/api/leads", {
      method: "POST",
      body: JSON.stringify(validLeadPayload),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.name).toBe(validLeadPayload.name);

    expect(requireAuth).toHaveBeenCalledWith(req);
    expect(Leadsmodel.prototype.save).toHaveBeenCalled();
  });

  it("returns 401 when authentication fails", async () => {
    mockAuthFailure();

    const req = new Request("http://localhost:3000/api/leads", {
      method: "POST",
      body: JSON.stringify(validLeadPayload),
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(Leadsmodel.prototype.save).not.toHaveBeenCalled();
  });

  it("returns 400 when validation fails", async () => {
    const invalid = {
      name: 123,
    };

    const req = new Request("http://localhost:3000/api/leads", {
      method: "POST",
      body: JSON.stringify(invalid),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBeDefined();
  });
});

describe("PUT /api/leads", () => {
  it("updates an existing lead successfully", async () => {
    (Leadsmodel.findOne as jest.Mock).mockResolvedValue({
      _id: "mongo-objectid-1",
      id: "lead-1",
    });

    (Leadsmodel.findOneAndUpdate as jest.Mock).mockResolvedValue({
      ...validLeadPayload,
      name: "Updated Name",
    });

    const req = new Request(
      "http://localhost:3000/api/leads?id=lead-1",
      {
        method: "PUT",
        body: JSON.stringify(validLeadPayload),
      }
    );

    const res = await PUT(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.name).toBe("Updated Name");

    expect(requireAuth).toHaveBeenCalledWith(req);
    expect(Leadsmodel.findOneAndUpdate).toHaveBeenCalled();
  });

  it("returns 400 if id query param missing", async () => {
    const req = new Request("http://localhost:3000/api/leads", {
      method: "PUT",
      body: JSON.stringify(validLeadPayload),
    });

    const res = await PUT(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toContain("ID");
  });

  it("returns 404 when lead not found", async () => {
    (Leadsmodel.findOne as jest.Mock).mockResolvedValue(null);

    const req = new Request(
      "http://localhost:3000/api/leads?id=missing",
      {
        method: "PUT",
        body: JSON.stringify(validLeadPayload),
      }
    );

    const res = await PUT(req);

    expect(res.status).toBe(404);
    expect(Leadsmodel.findOneAndUpdate).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/leads", () => {
  it("deletes a lead successfully with Cloudinary cleanup", async () => {
    (Leadsmodel.findOne as jest.Mock).mockResolvedValue({
      _id: "mongo-objectid-1",
      name: "user",
      imageUrl: "https://res.cloudinary.com/test/v123/leads/user.jpg",
    });

    (Leadsmodel.deleteOne as jest.Mock).mockResolvedValue({
      deletedCount: 1,
    });

    (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
      result: "ok",
    });

    const req = new Request(
      "http://localhost:3000/api/leads?id=lead-1",
      { method: "DELETE" }
    );

    const res = await DELETE(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.message).toBeDefined();

    expect(requireAuth).toHaveBeenCalledWith(req);
    expect(cloudinary.uploader.destroy)
      .toHaveBeenCalledWith(expect.stringContaining("leads/"));
  });

  it("returns 401 if authentication fails", async () => {
    mockAuthFailure();

    const req = new Request(
      "http://localhost:3000/api/leads?id=lead-1",
      { method: "DELETE" }
    );

    const res = await DELETE(req);

    expect(res.status).toBe(401);
    expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
  });

  it("returns 400 if id missing", async () => {
    const req = new Request("http://localhost:3000/api/leads", {
      method: "DELETE",
    });

    const res = await DELETE(req);

    expect(res.status).toBe(400);
  });

  it("returns 404 if lead not found", async () => {
    (Leadsmodel.findOne as jest.Mock).mockResolvedValue(null);

    const req = new Request(
      "http://localhost:3000/api/leads?id=missing",
      { method: "DELETE" }
    );

    const res = await DELETE(req);

    expect(res.status).toBe(404);
  });
});
