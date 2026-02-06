import mongoose, { Schema, Model } from 'mongoose';
import { ITask, ISubtask } from '@/types';

const SubtaskSchema = new Schema<ISubtask>({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const TaskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    subtasks: [SubtaskSchema],
    deadline: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ['private', 'shared', 'joint'],
      default: 'private',
    },
    sharedWith: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
