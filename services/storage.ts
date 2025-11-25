import { Dream, Section } from "../types";

const STORAGE_KEY = 'somnium_dreams_v1';
const SECTIONS_KEY = 'somnium_sections_v1';
const PREMIUM_KEY = 'somnium_premium_v1';

export const getDreams = (): Dream[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load dreams", e);
    return [];
  }
};

export const saveDream = (dream: Dream): void => {
  const dreams = getDreams();
  const updated = [dream, ...dreams];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const updateDream = (updatedDream: Dream): void => {
  const dreams = getDreams();
  const index = dreams.findIndex(d => d.id === updatedDream.id);
  if (index !== -1) {
    dreams[index] = updatedDream;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
  }
};

export const deleteDream = (id: string): void => {
    const dreams = getDreams().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
};

// Section Management
export const getSections = (): Section[] => {
  try {
    const data = localStorage.getItem(SECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveSection = (section: Section): void => {
  const sections = getSections();
  const updated = [...sections, section];
  localStorage.setItem(SECTIONS_KEY, JSON.stringify(updated));
};

export const deleteSection = (id: string): void => {
  const sections = getSections().filter(s => s.id !== id);
  localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
  
  // Optional: Move dreams from deleted section to 'general' (null sectionId)
  const dreams = getDreams();
  const updatedDreams = dreams.map(d => d.sectionId === id ? { ...d, sectionId: undefined } : d);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDreams));
};

// Premium Management
export const getPremiumStatus = (): boolean => {
  try {
    return localStorage.getItem(PREMIUM_KEY) === 'true';
  } catch (e) {
    return false;
  }
};

export const savePremiumStatus = (isPremium: boolean): void => {
  localStorage.setItem(PREMIUM_KEY, String(isPremium));
};