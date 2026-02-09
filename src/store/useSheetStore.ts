import { create } from 'zustand';

export interface Question {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  link?: string;
  completed: boolean;
}

export interface SubTopic {
  id: string;
  title: string;
  questions: Question[];
}

export interface Topic {
  id: string;
  title: string;
  subTopics: SubTopic[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialData: Topic[] = [
  {
    id: generateId(),
    title: 'Arrays & Hashing',
    subTopics: [
      {
        id: generateId(),
        title: 'Basic Array Operations',
        questions: [
          { id: generateId(), title: 'Two Sum', difficulty: 'easy', link: 'https://leetcode.com/problems/two-sum', completed: false },
          { id: generateId(), title: 'Contains Duplicate', difficulty: 'easy', completed: true },
          { id: generateId(), title: 'Valid Anagram', difficulty: 'easy', completed: false },
        ],
      },
      {
        id: generateId(),
        title: 'Advanced Hashing',
        questions: [
          { id: generateId(), title: 'Group Anagrams', difficulty: 'medium', completed: false },
          { id: generateId(), title: 'Top K Frequent Elements', difficulty: 'medium', completed: true },
        ],
      },
    ],
  },
  {
    id: generateId(),
    title: 'Linked Lists',
    subTopics: [
      {
        id: generateId(),
        title: 'Singly Linked List',
        questions: [
          { id: generateId(), title: 'Reverse Linked List', difficulty: 'easy', completed: false },
          { id: generateId(), title: 'Merge Two Sorted Lists', difficulty: 'easy', completed: false },
        ],
      },
    ],
  },
  {
    id: generateId(),
    title: 'Binary Trees',
    subTopics: [
      {
        id: generateId(),
        title: 'Tree Traversals',
        questions: [
          { id: generateId(), title: 'Inorder Traversal', difficulty: 'easy', completed: false },
          { id: generateId(), title: 'Level Order Traversal', difficulty: 'medium', completed: false },
          { id: generateId(), title: 'Maximum Depth', difficulty: 'easy', completed: true },
        ],
      },
      {
        id: generateId(),
        title: 'BST Operations',
        questions: [
          { id: generateId(), title: 'Validate BST', difficulty: 'medium', completed: false },
          { id: generateId(), title: 'Lowest Common Ancestor', difficulty: 'medium', completed: false },
        ],
      },
    ],
  },
  {
    id: generateId(),
    title: 'Dynamic Programming',
    subTopics: [
      {
        id: generateId(),
        title: '1D DP',
        questions: [
          { id: generateId(), title: 'Climbing Stairs', difficulty: 'easy', completed: true },
          { id: generateId(), title: 'House Robber', difficulty: 'medium', completed: false },
          { id: generateId(), title: 'Longest Increasing Subsequence', difficulty: 'medium', completed: false },
        ],
      },
      {
        id: generateId(),
        title: '2D DP',
        questions: [
          { id: generateId(), title: 'Unique Paths', difficulty: 'medium', completed: false },
          { id: generateId(), title: 'Edit Distance', difficulty: 'hard', completed: false },
        ],
      },
    ],
  },
];

interface SheetStore {
  topics: Topic[];
  
  // Topic CRUD
  addTopic: (title: string) => void;
  updateTopic: (id: string, title: string) => void;
  deleteTopic: (id: string) => void;
  reorderTopics: (fromIndex: number, toIndex: number) => void;
  
  // SubTopic CRUD
  addSubTopic: (topicId: string, title: string) => void;
  updateSubTopic: (topicId: string, subTopicId: string, title: string) => void;
  deleteSubTopic: (topicId: string, subTopicId: string) => void;
  reorderSubTopics: (topicId: string, fromIndex: number, toIndex: number) => void;
  
  // Question CRUD
  addQuestion: (topicId: string, subTopicId: string, question: Omit<Question, 'id'>) => void;
  updateQuestion: (topicId: string, subTopicId: string, questionId: string, data: Partial<Question>) => void;
  deleteQuestion: (topicId: string, subTopicId: string, questionId: string) => void;
  toggleQuestion: (topicId: string, subTopicId: string, questionId: string) => void;
  reorderQuestions: (topicId: string, subTopicId: string, fromIndex: number, toIndex: number) => void;
}

const arrayMove = <T,>(arr: T[], from: number, to: number): T[] => {
  const newArr = [...arr];
  const [item] = newArr.splice(from, 1);
  newArr.splice(to, 0, item);
  return newArr;
};

export const useSheetStore = create<SheetStore>((set) => ({
  topics: initialData,

  addTopic: (title) =>
    set((state) => ({
      topics: [...state.topics, { id: generateId(), title, subTopics: [] }],
    })),

  updateTopic: (id, title) =>
    set((state) => ({
      topics: state.topics.map((t) => (t.id === id ? { ...t, title } : t)),
    })),

  deleteTopic: (id) =>
    set((state) => ({ topics: state.topics.filter((t) => t.id !== id) })),

  reorderTopics: (fromIndex, toIndex) =>
    set((state) => ({ topics: arrayMove(state.topics, fromIndex, toIndex) })),

  addSubTopic: (topicId, title) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? { ...t, subTopics: [...t.subTopics, { id: generateId(), title, questions: [] }] }
          : t
      ),
    })),

  updateSubTopic: (topicId, subTopicId, title) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? { ...t, subTopics: t.subTopics.map((s) => (s.id === subTopicId ? { ...s, title } : s)) }
          : t
      ),
    })),

  deleteSubTopic: (topicId, subTopicId) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? { ...t, subTopics: t.subTopics.filter((s) => s.id !== subTopicId) }
          : t
      ),
    })),

  reorderSubTopics: (topicId, fromIndex, toIndex) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId ? { ...t, subTopics: arrayMove(t.subTopics, fromIndex, toIndex) } : t
      ),
    })),

  addQuestion: (topicId, subTopicId, question) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subTopicId
                  ? { ...s, questions: [...s.questions, { ...question, id: generateId() }] }
                  : s
              ),
            }
          : t
      ),
    })),

  updateQuestion: (topicId, subTopicId, questionId, data) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subTopicId
                  ? { ...s, questions: s.questions.map((q) => (q.id === questionId ? { ...q, ...data } : q)) }
                  : s
              ),
            }
          : t
      ),
    })),

  deleteQuestion: (topicId, subTopicId, questionId) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subTopicId
                  ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) }
                  : s
              ),
            }
          : t
      ),
    })),

  toggleQuestion: (topicId, subTopicId, questionId) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subTopicId
                  ? { ...s, questions: s.questions.map((q) => (q.id === questionId ? { ...q, completed: !q.completed } : q)) }
                  : s
              ),
            }
          : t
      ),
    })),

  reorderQuestions: (topicId, subTopicId, fromIndex, toIndex) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subTopicId
                  ? { ...s, questions: arrayMove(s.questions, fromIndex, toIndex) }
                  : s
              ),
            }
          : t
      ),
    })),
}));
