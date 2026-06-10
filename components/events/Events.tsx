"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import EventsSection, {
  type EventItemWithId,
} from "@/components/events/EventsSection";
import { useAuthStore } from "@/lib/store/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { UploadCloudIcon, XIcon } from "lucide-react";

export interface Event {
  _id: string;
  id: string;
  eventName: string;
  description: string;
  eventDate: string;
  lastDateOfRegistration: string;
  imageURL: string;
  registrationLink: string;
}

type EventForm = Omit<Event, "_id">;

const blankForm: EventForm = {
  id: "",
  eventName: "",
  description: "",
  eventDate: "",
  lastDateOfRegistration: "",
  imageURL: "",
  registrationLink: "",
};

function toEventItem(event: Event): EventItemWithId {
  return {
    _id: event._id,
    title: event.eventName,
    description: event.description,
    image: event.imageURL,
    date: event.eventDate,
    location: "Bangalore, Karnataka",
    registrationLink: event.registrationLink,
  };
}

function isUpcoming(event: Event): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(event.eventDate) >= today;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const TEXT_FIELDS: {
  label: string;
  key: keyof EventForm;
  type: string;
  required?: boolean;
}[] = [
  { label: "Event Name", key: "eventName", type: "text", required: true },
  { label: "Description", key: "description", type: "text", required: true },
  { label: "Event Date", key: "eventDate", type: "date", required: true },
  {
    label: "Last Date of Registration",
    key: "lastDateOfRegistration",
    type: "date",
    required: true,
  },
  {
    label: "Registration Link",
    key: "registrationLink",
    type: "url",
    required: true,
  },
];

export default function Events(props: { events: Event[] }) {
  const [events, setEvents] = useState<Event[]>(props.events || []);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const { authenticated, token } = useAuthStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<EventForm>(blankForm);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = (id: string) => {
    setFlippedId((prev) => (prev === id ? null : id));
  };

  const openAdd = () => {
    setEditEvent(null);
    setForm(blankForm);
    setUploadError(null);
    setModalOpen(true);
  };

  const openEdit = (item: EventItemWithId) => {
    const event = events.find((e) => e._id === item._id);
    if (!event) return;
    setEditEvent(event);
    setForm({
      id: event.id,
      eventName: event.eventName,
      description: event.description,
      eventDate: event.eventDate,
      lastDateOfRegistration: event.lastDateOfRegistration,
      imageURL: event.imageURL,
      registrationLink: event.registrationLink,
    });
    setUploadError(null);
    setModalOpen(true);
  };

  const openDelete = (item: EventItemWithId) => {
    const event = events.find((e) => e._id === item._id);
    if (event) setDeleteTarget(event);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("module", "events");
    formData.append("file", file);

    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.status === 201)
        setForm((prev) => ({ ...prev, imageURL: data.url }));
      else setUploadError(data.error ?? "Upload failed");
    } catch {
      setUploadError("Network error during upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearImage = () => {
    setForm((prev) => ({ ...prev, imageURL: "" }));
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: EventForm = {
        ...form,
        id: form.id || slugify(form.eventName) + "-" + Date.now(),
      };

      if (editEvent) {
        const res = await fetch("/api/events", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...payload, _id: editEvent._id }),
        });
        const data = await res.json();
        if (data.success) {
          setEvents((prev) =>
            prev.map((e) => (e._id === editEvent._id ? data.event : e)),
          );
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setEvents((prev) => [...prev, data.event]);
          setModalOpen(false);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/events?id=${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setEvents((prev) => prev.filter((e) => e._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  const upcoming = events
    .filter(isUpcoming)
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
    )
    .map(toEventItem);
  const past = events
    .filter((e) => !isUpcoming(e))
    .sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
    )
    .map(toEventItem);

  const isSaveDisabled =
    saving ||
    uploading ||
    !form.eventName ||
    !form.description ||
    !form.eventDate ||
    !form.lastDateOfRegistration ||
    !form.imageURL ||
    !form.registrationLink;

  return (
    <>
      {authenticated && (
        <div className="flex justify-center pt-8">
          <button
            onClick={openAdd}
            className="px-6 py-2 bg-pbgreen text-black font-medium rounded-full hover:opacity-90 transition-opacity text-sm cursor-pointer"
          >
            + Add Event
          </button>
        </div>
      )}

      <>
        {upcoming.length > 0 && (
          <EventsSection
            title="Upcoming Events"
            events={upcoming}
            flippedId={flippedId}
            onToggle={handleToggle}
            isAdmin={authenticated}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}
        {past.length > 0 && (
          <EventsSection
            title="Past Events"
            events={past}
            flippedId={flippedId}
            onToggle={handleToggle}
            isAdmin={authenticated}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}

        {past.length == 0 && upcoming.length == 0 && (
          <div className="px-4 sm:px-10 lg:px-20">
            <span className="text-white text-xl max-w-8xl mx-auto block">
              No Upcoming Events
            </span>
          </div>
        )}
      </>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="dark bg-pbpages border-pbborder text-white max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-base">
              {editEvent ? "Edit Event" : "Add Event"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            {TEXT_FIELDS.map(({ label, key, type, required }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <Label className="text-pbtext text-xs">
                  {label}
                  {required && <span className="text-pbgreen ml-0.5">*</span>}
                </Label>
                <Input
                  type={type}
                  value={(form[key] as string) ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="bg-pbgray border-pbborder text-white placeholder:text-pbtext/50 focus-visible:border-pbgreen focus-visible:ring-pbgreen/20 h-8"
                />
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <Label className="text-pbtext text-xs">
                Event Image<span className="text-pbgreen ml-0.5">*</span>
              </Label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              {form.imageURL ? (
                <div className="relative w-full aspect-video max-w-full mx-auto rounded-xl overflow-hidden border border-pbborder group">
                  <Image
                    src={form.imageURL}
                    alt="Preview"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-black transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <XIcon className="h-3.5 w-3.5 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="text-[10px] text-white bg-black/70 px-2 py-0.5 rounded-full">
                      Change
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex flex-col items-center justify-center gap-2 w-full py-6 rounded-xl border border-dashed border-pbborder hover:border-pbgreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UploadCloudIcon className="h-6 w-6 text-pbtext" />
                  <span className="text-pbtext text-xs">
                    {uploading ? "Uploading…" : "Click to upload image"}
                  </span>
                  <span className="text-pbtext/50 text-[10px]">
                    PNG, JPG, WEBP — max 10 MB
                  </span>
                </button>
              )}

              {uploading && (
                <div className="flex flex-col gap-1">
                  <Progress
                    value={null}
                    className="h-1.5 bg-pbborder *:data-[slot=progress-indicator]:bg-pbgreen animate-pulse"
                  />
                  <span className="text-pbtext/60 text-[10px] text-right">
                    Uploading…
                  </span>
                </div>
              )}

              {uploadError && (
                <p className="text-red-400 text-xs">{uploadError}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="border-pbborder text-pbtext hover:text-white hover:border-white bg-transparent flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className="bg-pbgreen text-black hover:bg-pbgreen/90 font-medium flex-1"
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="dark bg-pbpages border-pbborder text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-base">
              Delete Event
            </DialogTitle>
          </DialogHeader>

          <p className="text-pbtext text-sm py-2">
            Are you sure you want to delete{" "}
            <span className="text-white font-medium">
              {deleteTarget?.eventName}
            </span>
            ? This action cannot be undone.
          </p>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="border-pbborder text-pbtext hover:text-white hover:border-white bg-transparent flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white font-medium flex-1"
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
