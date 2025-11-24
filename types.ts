export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  NEW_ENTRY = 'NEW_ENTRY',
  DREAM_DETAIL = 'DREAM_DETAIL',
  STATS = 'STATS',
  FAVORITES = 'FAVORITES',
  SECTION = 'SECTION',
}

export interface Section {
  id: string;
  name: string;
}

export interface DreamAnalysis {
  title: string;
  summary: string;
  interpretation: string;
  mood: string;
  sentimentScore: number; // 0-100
  tags: string[];
  colorHex: string; // A color representing the dream
}

export interface Dream {
  id: string;
  date: string; // ISO string
  content: string;
  analysis?: DreamAnalysis;
  imageUrl?: string;
  isFavorite: boolean;
  isLucid: boolean;
  customLabels: string[];
  sectionId?: string;
}

export interface ChartDataPoint {
  date: string;
  score: number;
  mood: string;
}