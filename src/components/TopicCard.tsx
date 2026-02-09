import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { GripVertical, Plus, Pencil, Trash2, ChevronDown, Hash } from 'lucide-react';
import { Topic, useSheetStore } from '@/store/useSheetStore';
import { SubTopicSection } from './SubTopicSection';
import { Button } from '@/components/ui/button';
import { InlineEditInput } from './InlineEditInput';
import { AddItemInput } from './AddItemInput';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TopicCardProps {
  topic: Topic;
  index: number;
}

export const TopicCard = ({ topic, index }: TopicCardProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddSubTopic, setShowAddSubTopic] = useState(false);

  const { updateTopic, deleteTopic, addSubTopic, reorderSubTopics } = useSheetStore();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: topic.id,
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const totalQuestions = topic.subTopics.reduce((sum, st) => sum + st.questions.length, 0);
  const completedQuestions = topic.subTopics.reduce(
    (sum, st) => sum + st.questions.filter((q) => q.completed).length,
    0
  );
  const progress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

  const handleSubTopicDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = topic.subTopics.findIndex((s) => s.id === active.id);
    const newIndex = topic.subTopics.findIndex((s) => s.id === over.id);
    reorderSubTopics(topic.id, oldIndex, newIndex);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-xl border bg-card shadow-card transition-all animate-fade-in',
        isDragging && 'opacity-50 shadow-elevated z-50'
      )}
    >
      {/* Header */}
      <div className="group flex items-center gap-3 px-5 py-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity touch-none"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground">
          <ChevronDown className={cn('h-5 w-5 transition-transform duration-200', collapsed && '-rotate-90')} />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Hash className="h-4 w-4 text-accent-foreground" />
        </div>

        {isEditing ? (
          <InlineEditInput
            value={topic.title}
            onSave={(val) => { updateTopic(topic.id, val); setIsEditing(false); }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold truncate">{topic.title}</h3>
            <p className="text-xs text-muted-foreground font-mono">
              {completedQuestions}/{totalQuestions} solved · {topic.subTopics.length} sub-topics
            </p>
          </div>
        )}

        {/* Progress bar */}
        <div className="hidden sm:flex items-center gap-2 min-w-[120px]">
          <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full gradient-brand transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground w-9 text-right">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete topic?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{topic.title}" and all its sub-topics and questions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteTopic(topic.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="px-5 pb-4 space-y-2">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSubTopicDragEnd}>
            <SortableContext items={topic.subTopics.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {topic.subTopics.map((st) => (
                <SubTopicSection key={st.id} subTopic={st} topicId={topic.id} />
              ))}
            </SortableContext>
          </DndContext>

          {showAddSubTopic ? (
            <AddItemInput
              placeholder="Sub-topic name..."
              onSave={(val) => { addSubTopic(topic.id, val); setShowAddSubTopic(false); }}
              onCancel={() => setShowAddSubTopic(false)}
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-primary"
              onClick={() => setShowAddSubTopic(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Sub-topic
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
