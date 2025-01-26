import mongoose , {Schema , Document , Model, mongo } from 'mongoose';

export interface ICredit extends Document {
    name: string;
    description: string;
    imageUrl: string;
    linkedinUrl: string;
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
        description: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        linkedinUrl: {
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