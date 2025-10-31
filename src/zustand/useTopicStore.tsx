import { TopicStore } from "@/app/types/store";
import { create } from "zustand";



export const useTopicStore = create<TopicStore>((set) => ({
  topics: [],
  setTopics: (topics) => set({ topics }),
  clearTopics: () => set({ topics: [] }),
  pushTopic: (topic) =>
    set((state) => ({
      topics: [...state.topics, topic]
    }))
}))