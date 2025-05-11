import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  stipend: { type: Number, default: null },
  year: { type: Number, required: true },
});

const testAchievementsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  batch: { type: String, required: true },
  portfolio: { type: String, default: null },
  imageUrl: { type: String, default: null },
  achievements: {
    GSoC: [achievementSchema],
    Hackathon: [achievementSchema],
    CP: [achievementSchema],
  },
});

export default mongoose.models.TestAchievements ||
  mongoose.model('TestAchievements', testAchievementsSchema);