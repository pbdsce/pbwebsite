import EventModel, { type Events } from "@/lib/db/models/events";

export const getAllEvents = async (): Promise<Events[]> => {
  try {
    const events = await EventModel.find().lean();
    return events as Events[];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const getEventById = async (id: string): Promise<Events | null> => {
  try {
    const event = await EventModel.findById(id).lean();
    return event as Events | null;
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    return null;
  }
};

export const createEvent = async (
  eventData: Omit<Events, "_id">,
): Promise<Events | null> => {
  try {
    const savedEvent = await new EventModel(eventData).save();
    return savedEvent as Events;
  } catch (error) {
    console.error("Error creating event:", error);
    return null;
  }
};

export const updateEvent = async (
  eventData: Events,
): Promise<Events | null> => {
  try {
    const updatedEvent = await EventModel.findByIdAndUpdate(
      eventData._id,
      eventData,
      { new: true },
    ).lean();
    return updatedEvent as Events | null;
  } catch (error) {
    console.error(`Error updating event with id ${eventData._id}:`, error);
    return null;
  }
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    await EventModel.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.error(`Error deleting event with id ${id}:`, error);
    return false;
  }
};
