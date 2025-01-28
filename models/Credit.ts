import mongoose , {Schema , Document , Model, mongo } from 'mongoose';

export interface ICredit extends Document {
    name: string;
    userId: Number;
    imageUrl: string;
    githubUrl: string;
    publicId: string;
    createdAt: Date;
    updatedAt: Date;
}

const CreditSchema: Schema = new Schema<ICredit>(
    {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: Number,
        },
        imageUrl: {
            type: String,
            required: true
        },
        githubUrl: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

const Credit: Model<ICredit> = mongoose.models.Credit || mongoose.model<ICredit>('Credit' , CreditSchema);

export default Credit;