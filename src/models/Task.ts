import mongoose, { Schema, Document } from 'mongoose';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface ITask extends Document {
  title: string;
  description: string;
  project: mongoose.Types.ObjectId;
  assignee: mongoose.Types.ObjectId;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  createdBy: mongoose.Types.ObjectId;
  reports?: Array<{
    userId: mongoose.Types.ObjectId;
    message: string;
    status?: TaskStatus;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reports: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        message: { type: String },
        status: { type: String, enum: Object.values(TaskStatus) },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Task ||
  mongoose.model<ITask>('Task', taskSchema);
