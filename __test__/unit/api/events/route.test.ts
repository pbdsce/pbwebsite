import { GET, POST, PUT, DELETE } from "@/app/(default)/api/events/route";
import Eventmodel from "@/models/Events";
import connectMongoDB from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import { cloudinary } from "@/Cloudinary";


jest.mock("@/lib/dbConnect", () => jest.fn());

jest.mock("@/lib/requireAuth", () => ({
  requireAuth: jest.fn(),
}));

jest.mock("@/models/Events", () => {
  const Model: any = jest.fn();
  Model.find = jest.fn();
  Model.findOne = jest.fn();
  Model.findOneAndUpdate = jest.fn();
  Model.deleteOne = jest.fn();
  return { __esModule: true, default: Model };
});

jest.mock("@/Cloudinary", () => ({
  cloudinary: {
    uploader: {
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

const validEvent = {
  eventName: "Demo Event",
  eventDate: "2025-10-10",
  lastDateOfRegistration: "2025-10-01",
  description: "This is a valid event description",
  imageURL: "https://cloudinary.com/event.jpg",
  registrationLink: "https://register.com",
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  authSuccess();
  (connectMongoDB as jest.Mock).mockResolvedValue(undefined);
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("GET /api/events", () => {
  it("returns all the events in a sorted way", async () => {
    (Eventmodel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ id: "1", eventName: "Event" }]),
    });

    const res = await GET(new Request("http://localhost:3000/api/events"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.events).toHaveLength(1);
    expect(Eventmodel.find).toHaveBeenCalled();
  });

  it("returns 500 on DB failure", async () => {
    (Eventmodel.find as jest.Mock).mockImplementation(() => ({
      sort: jest.fn().mockRejectedValue(new Error("DB fail")),
    }));

    const res = await GET(new Request("http://localhost:3000/api/events"));
    expect(res.status).toBe(500);
  });
});

describe("POST /api/events", () => {
  it("creates event successfully", async () => {
    const saveMock = jest.fn().mockResolvedValue(true);
    (Eventmodel as unknown as jest.Mock).mockImplementation(() => ({
      save: saveMock,
    }));

    const res = await POST(
      new Request("http://localhost:3000/api/events", {
        method: "POST",
        body: JSON.stringify(validEvent),
      })
    );

    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body).toHaveProperty("id");
    expect(saveMock).toHaveBeenCalled();
  });

  it("blocks unauthenticated request", async () => {
    authFailure();

    const res = await POST(
      new Request("http://localhost:3000/api/events", { method: "POST" })
    );

    expect(res.status).toBe(401);
    expect(Eventmodel).not.toHaveBeenCalled();
  });

  it("returns 400 on validation error", async () => {
    const res = await POST(
      new Request("http://localhost:3000/api/events", {
        method: "POST",
        body: JSON.stringify({}),
      })
    );

    expect(res.status).toBe(400);
  });
});

describe("PUT /api/events", () => {
  it("updates event", async () => {
    (Eventmodel.findOneAndUpdate as jest.Mock).mockResolvedValue({ id: "1" });

    const res = await PUT(
      new Request("http://localhost:3000/api/events?eventid=1", {
        method: "PUT",
        body: JSON.stringify(validEvent),
      })
    );

    expect(res.status).toBe(200);
  });

  it("returns 404 if event not found", async () => {
    (Eventmodel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    const res = await PUT(
      new Request("http://localhost:3000/api/events?eventid=missing", {
        method: "PUT",
        body: JSON.stringify(validEvent),
      })
    );

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/events", () => {
  it("deletes event and cloudinary image", async () => {
    (Eventmodel.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      imageURL: "https://cloudinary.com/v123/events/img.jpg",
    });

    (Eventmodel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });
    (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({ result: "ok" });

    const res = await DELETE(
      new Request("http://localhost:3000/api/events?eventid=1", {
        method: "DELETE",
      })
    );

    expect(res.status).toBe(200);
    expect(cloudinary.uploader.destroy).toHaveBeenCalled();
  });

  it("continues deletion if Cloudinary fails", async () => {
    (Eventmodel.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      imageURL: "https://cloudinary.com/img.jpg",
    });

    (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(
      new Error("Cloudinary down")
    );

    const res = await DELETE(
      new Request("http://localhost:3000/api/events?eventid=1", {
        method: "DELETE",
      })
    );

    expect(res.status).toBe(200);
  });

  it("returns 404 if event missing", async () => {
    (Eventmodel.findOne as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(
      new Request("http://localhost:3000/api/events?eventid=missing", {
        method: "DELETE",
      })
    );

    expect(res.status).toBe(404);
  });
});
