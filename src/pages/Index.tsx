import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, BookOpen, Target } from 'lucide-react';
import { useSheetStore } from '@/store/useSheetStore';
import { TopicCard } from '@/components/TopicCard';
import { AddItemInput } from '@/components/AddItemInput';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { topics, addTopic, reorderTopics } = useSheetStore();
  const [showAddTopic, setShowAddTopic] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const totalQuestions = topics.reduce(
    (sum, t) => sum + t.subTopics.reduce((s, st) => s + st.questions.length, 0),
    0
  );
  const completedQuestions = topics.reduce(
    (sum, t) => sum + t.subTopics.reduce((s, st) => s + st.questions.filter((q) => q.completed).length, 0),
    0
  );
  const overallProgress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = topics.findIndex((t) => t.id === active.id);
    const newIndex = topics.findIndex((t) => t.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) reorderTopics(oldIndex, newIndex);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Question Sheet</h1>
                <p className="text-sm text-muted-foreground">Track your coding progress</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="flex items-center gap-1.5 justify-end">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold">{Math.round(overallProgress)}%</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {completedQuestions}/{totalQuestions} solved
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl border-2 border-primary/20 flex items-center justify-center">
                <div
                  className="rounded-lg gradient-brand transition-all duration-500"
                  style={{
                    width: `${Math.max(8, overallProgress * 0.32)}px`,
                    height: `${Math.max(8, overallProgress * 0.32)}px`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full gradient-brand transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={topics.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {topics.map((topic, i) => (
              <TopicCard key={topic.id} topic={topic} index={i} />
            ))}
          </SortableContext>
        </DndContext>

        {showAddTopic ? (
          <div className="rounded-xl border bg-card p-4 shadow-card">
            <AddItemInput
              placeholder="Topic name..."
              onSave={(val) => { addTopic(val); setShowAddTopic(false); }}
              onCancel={() => setShowAddTopic(false)}
            />
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full border-dashed h-12 text-muted-foreground hover:text-primary hover:border-primary"
            onClick={() => setShowAddTopic(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Topic
          </Button>
        )}
      </main>
    </div>
  );
};

export default Index;
