import TalkModel, { type Talk } from "@/lib/db/models/talks";

type TalkInput = {
  title: string;
  description: string;
  images: string[];
  type: "conference" | "talks" | "other";
  name: string;
  date: Date | string;
  speakers: string;
  speakerLinkedins?: string;
  link?: string;
};

export const getAllTalks = async (): Promise<Talk[]> => {
  try {
    const talks = await TalkModel.find().lean();
    return talks as Talk[];
  } catch (error) {
    console.error("Error fetching talks:", error);
    return [];
  }
};

export const getTalkById = async (id: string): Promise<Talk | null> => {
  try {
    const talk = await TalkModel.findById(id).lean();
    return talk as Talk | null;
  } catch (error) {
    console.error(`Error fetching talk with id ${id}:`, error);
    return null;
  }
};

export const createTalk = async (talkData: TalkInput): Promise<Talk | null> => {
  try {
    const savedTalk = await new TalkModel(talkData).save();
    return savedTalk as Talk;
  } catch (error) {
    console.error("Error creating talk:", error);
    return null;
  }
};

export const updateTalk = async (
  talkData: TalkInput & { _id: string },
): Promise<Talk | null> => {
  try {
    const updatedTalk = await TalkModel.findByIdAndUpdate(
      talkData._id,
      talkData,
      { new: true },
    ).lean();
    return updatedTalk as Talk | null;
  } catch (error) {
    console.error(`Error updating talk with id ${talkData._id}:`, error);
    return null;
  }
};

export const deleteTalk = async (id: string): Promise<boolean> => {
  try {
    await TalkModel.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.error(`Error deleting talk with id ${id}:`, error);
    return false;
  }
};
