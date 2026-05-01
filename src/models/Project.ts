import mongoose, { Schema, Document } from 'mongoose';

export enum ProjectRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export interface IProjectMember {
  userId: mongoose.Types.ObjectId;
  role: ProjectRole;
}

export interface IProject extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  members: IProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: Object.values(ProjectRole),
          default: ProjectRole.MEMBER,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model<IProject>('Project', projectSchema);
