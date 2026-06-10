import AchievementsModel, {
  type Achievements,
} from "@/lib/db/models/achievements";

export const getAllAchievements = async (): Promise<Achievements[]> => {
  try {
    const achievements = await AchievementsModel.find().lean();
    return achievements as Achievements[];
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
};

export const getAchievementsById = async (
  id: string,
): Promise<Achievements | null> => {
  try {
    const achievements = await AchievementsModel.findById(id).lean();
    return achievements as Achievements | null;
  } catch (error) {
    console.error(`Error fetching achievements with id ${id}:`, error);
    return null;
  }
};

export const createAchievements = async (
  data: Pick<Achievements, "name" | "imageUrl" | "achivements">,
): Promise<Achievements | null> => {
  try {
    const saved = await new AchievementsModel(data).save();
    return saved as Achievements;
  } catch (error) {
    console.error("Error creating achievements:", error);
    return null;
  }
};

export const updateAchievements = async (
  data: Achievements,
): Promise<Achievements | null> => {
  try {
    const updated = await AchievementsModel.findByIdAndUpdate(data._id, data, {
      new: true,
    }).lean();
    return updated as Achievements | null;
  } catch (error) {
    console.error(`Error updating achievements with id ${data._id}:`, error);
    return null;
  }
};

export const deleteAchievements = async (id: string): Promise<boolean> => {
  try {
    await AchievementsModel.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.error(`Error deleting achievements with id ${id}:`, error);
    return false;
  }
};
