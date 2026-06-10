import LoreType from "@/types/lore/loreType";
import Lore from "../db/models/lores";

export async function getAllLores(): Promise<LoreType[]> {
  try {
    const lores = await Lore.find().lean();
    return lores as unknown as LoreType[];
  } catch (error) {
    console.error("Error fetching lores:", error);
    return [];
  }
}

export async function uploadLore(loreData: Omit<LoreType, "_id">) {
  try {
    const savedLore = await new Lore(loreData).save();
    return savedLore as unknown as LoreType;
  } catch (err) {
    console.error("Error creating lore:", err);
    return null;
  }
}

export async function getLoreById(id: string) {
  try {
    return await Lore.findById(id).lean();
  } catch (error) {
    console.error(`Error fetching lore with id ${id}:`, error);
    return null;
  }
}

export async function updateLore(loreData: LoreType) {
  try {
    const updatedLore = await Lore.findByIdAndUpdate(loreData._id, loreData, {
      new: true,
    }).lean();
    return updatedLore as unknown as LoreType | null;
  } catch (error) {
    console.error(`Error updating lore with id ${loreData._id}:`, error);
    return null;
  }
}

export async function deleteLore(id: string) {
  try {
    await Lore.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.error(`Error deleting lore with id ${id}:`, error);
    return false;
  }
}
