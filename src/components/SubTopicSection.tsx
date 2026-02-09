import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { GripVertical, Plus, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { SubTopic } from '@/store/useSheetStore';
import { useSheetStore } from '@/store/useSheetStore';
import { QuestionItem } from './QuestionItem';
import { Button } from '@/components/ui/button';
import { QuestionDialog } from './QuestionDialog';
import { InlineEditInput } from './InlineEditInput';
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

interface SubTopicSectionProps {
  subTopic: SubTopic;
  topicId: string;
}

export const SubTopicSection = ({ subTopic, topicId }: SubTopicSectionProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [questionDialog, setQuestionDialog] = useState<{ open: boolean; question?: typeof subTopic.questions[0] }>({ open: false });

  const { updateSubTopic, deleteSubTopic, addQuestion, updateQuestion, deleteQuestion, toggleQuestion, reorderQuestions } = useSheetStore();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: subTopic.id,
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const completed = subTopic.questions.filter((q) => q.completed).length;
  const total = subTopic.questions.length;

  const handleQuestionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = subTopic.questions.findIndex((q) => q.id === active.id);
    const newIndex = subTopic.questions.findIndex((q) => q.id === over.id);
    reorderQuestions(topicId, subTopic.id, oldIndex, newIndex);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-lg border bg-muted/30 transition-all',
        isDragging && 'opacity-50 shadow-elevated'
      )}
    >
      <div className="group flex items-center gap-2 px-4 py-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity touch-none"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground">
          <ChevronDown className={cn('h-4 w-4 transition-transform', collapsed && '-rotate-90')} />
        </button>

        {isEditing ? (
          <InlineEditInput
            value={subTopic.title}
            onSave={(val) => { updateSubTopic(topicId, subTopic.id, val); setIsEditing(false); }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <span className="flex-1 text-sm font-semibold">{subTopic.title}</span>
        )}

        <span className="text-xs font-mono text-muted-foreground">
          {completed}/{total}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(true)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete sub-topic?</AlertDialogTitle>
                <AlertDialogDescription>This will delete "{subTopic.title}" and all its questions.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteSubTopic(topicId, subTopic.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {!collapsed && (
        <div className="px-4 pb-3 space-y-1.5">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleQuestionDragEnd}>
            <SortableContext items={subTopic.questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
              {subTopic.questions.map((q) => (
                <QuestionItem
                  key={q.id}
                  question={q}
                  topicId={topicId}
                  subTopicId={subTopic.id}
                  onToggle={() => toggleQuestion(topicId, subTopic.id, q.id)}
                  onEdit={() => setQuestionDialog({ open: true, question: q })}
                  onDelete={() => deleteQuestion(topicId, subTopic.id, q.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-primary mt-1"
            onClick={() => setQuestionDialog({ open: true })}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Question
          </Button>
        </div>
      )}

      <QuestionDialog
        open={questionDialog.open}
        question={questionDialog.question}
        onClose={() => setQuestionDialog({ open: false })}
        onSave={(data) => {
          if (questionDialog.question) {
            updateQuestion(topicId, subTopic.id, questionDialog.question.id, data);
          } else {
            addQuestion(topicId, subTopic.id, { ...data, completed: false });
          }
          setQuestionDialog({ open: false });
        }}
      />
    </div>
  );
};
