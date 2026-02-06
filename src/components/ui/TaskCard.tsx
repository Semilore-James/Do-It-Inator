'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Clock, Share2, Users, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { ITask } from '@/types';
import { format, isPast } from 'date-fns';

interface TaskCardProps {
  task: ITask;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onSubtaskToggle: (taskId: string, subtaskId: string) => void;
}

export default function TaskCard({ task, onComplete, onDelete, onSubtaskToggle }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isOverdue = task.deadline && !task.completed && isPast(new Date(task.deadline));
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  const getVisibilityIcon = () => {
    switch (task.visibility) {
      case 'shared':
        return <Share2 className="w-4 h-4" />;
      case 'joint':
        return <Users className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className={`card-brutal ${task.completed ? 'bg-skyblue/50' : 'bg-cream'} ${isOverdue ? 'border-red-500' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => onComplete(task._id.toString())}
              className="flex-shrink-0"
              disabled={task.completed}
            >
              {task.completed ? (
                <CheckCircle className="w-6 h-6 text-green-600" fill="currentColor" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400 hover:text-purple transition-colors" />
              )}
            </button>
            
            <h3 className={`font-bold text-lg ${task.completed ? 'line-through opacity-60' : ''}`}>
              {task.title}
            </h3>

            {getVisibilityIcon()}
          </div>

          {/* Deadline */}
          {task.deadline && (
            <div className={`flex items-center gap-2 text-sm mb-2 ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
              <Clock className="w-4 h-4" />
              <span>
                {isOverdue ? 'OVERDUE: ' : ''}
                {format(new Date(task.deadline), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
          )}

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-700 mb-2">{task.description}</p>
          )}

          {/* Subtask Summary */}
          {hasSubtasks && (
            <div className="flex items-center gap-2 text-sm text-purple font-bold">
              <span>{completedSubtasks} / {totalSubtasks} subtasks</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {hasSubtasks && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-black/10 rounded transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          )}
          
          <button
            onClick={() => onDelete(task._id.toString())}
            className="p-2 hover:bg-red-500/20 rounded transition-colors"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Subtasks (Expanded) */}
      {isExpanded && hasSubtasks && (
        <div className="mt-4 pl-8 space-y-2 border-l-4 border-purple">
          {task.subtasks.map((subtask) => (
            <div key={subtask._id.toString()} className="flex items-center gap-2">
              <button
                onClick={() => onSubtaskToggle(task._id.toString(), subtask._id.toString())}
                disabled={task.completed}
              >
                {subtask.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" fill="currentColor" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-purple transition-colors" />
                )}
              </button>
              <span className={`text-sm ${subtask.completed ? 'line-through opacity-60' : ''}`}>
                {subtask.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
