import mongoose from "mongoose";

const TeamInviteSchema =
  new mongoose.Schema(
    {
      teamId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "ctfregs",

        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      token: {
        type: String,
        required: true,
        unique: true,
      },

      expiresAt: {
        type: Date,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

TeamInviteSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  }
);

export default
  mongoose.models.TeamInvite ||
  mongoose.model(
    "TeamInvite",
    TeamInviteSchema
  );