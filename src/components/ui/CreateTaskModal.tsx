'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (taskData: any) => void;
}

export default function CreateTaskModal({ isOpen, onClose, onCreate }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'shared' | 'joint'>('private');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskData = {
      title,
      description: description || undefined,
      deadline: deadline || undefined,
      visibility,
      subtasks: subtasks.map(text => ({ text })),
    };

    onCreate(taskData);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDeadline('');
    setVisibility('private');
    setSubtasks([]);
    setNewSubtask('');
    onClose();
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask.trim()]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="card-brutal bg-cream max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">Create New Task</h2>
          <button onClick={handleClose} className="p-2 hover:bg-black/10 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-bold mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-brutal w-full"
              placeholder="What needs to be done?"
              maxLength={100}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold mb-2">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-brutal w-full min-h-[100px] resize-y"
              placeholder="Add more details..."
              maxLength={500}
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block font-bold mb-2">Deadline (Optional)</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input-brutal w-full"
            />
            <p className="text-sm text-gray-600 mt-1">
              ⚠️ Miss this deadline = lose 1 HP
            </p>
          </div>

          {/* Subtasks */}
          <div>
            <label className="block font-bold mb-2">Subtasks (Optional)</label>
            
            {/* Existing Subtasks */}
            {subtasks.length > 0 && (
              <div className="space-y-2 mb-3">
                {subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white p-2 border-2 border-black">
                    <span className="flex-1">{subtask}</span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      className="p-1 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Subtask */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                className="input-brutal flex-1"
                placeholder="Add a subtask..."
                maxLength={100}
              />
              <button
                type="button"
                onClick={addSubtask}
                className="btn-brutal-secondary px-4"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block font-bold mb-2">Visibility</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span><strong>Private</strong> - Only you can see this</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="shared"
                  checked={visibility === 'shared'}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span><strong>Shared</strong> - Friends can view (read-only)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="joint"
                  checked={visibility === 'joint'}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span><strong>Joint</strong> - Friends can edit and complete</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn-brutal flex-1">
              Create Task
            </button>
            <button type="button" onClick={handleClose} className="btn-brutal-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
