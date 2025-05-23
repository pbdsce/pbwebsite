import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const achievementsCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, default: null },
  achievements: {
    GSoC: [achievementSchema],
    LFX: [achievementSchema],
    SIH: [achievementSchema],
    LIFT: [achievementSchema],
    Hackathons: [achievementSchema],
    CP: [achievementSchema],
  },
}, { collection: 'achievements_category' });

export default mongoose.models.AchievementsCategory ||
  mongoose.model('AchievementsCategory', achievementsCategorySchema); 