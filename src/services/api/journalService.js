import journalData from "@/services/mockData/journal.json";

let journalEntries = [...journalData];

export const journalService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...journalEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return journalEntries.find(entry => entry.Id === id);
  },

  async getByDate(date) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const dateStr = date.toISOString().split('T')[0];
    return journalEntries.filter(entry => entry.date.startsWith(dateStr));
  },

  async create(entryData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newEntry = {
      ...entryData,
      Id: Math.max(...journalEntries.map(e => e.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    journalEntries.push(newEntry);
    return newEntry;
  },

  async update(id, entryData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = journalEntries.findIndex(entry => entry.Id === id);
    if (index !== -1) {
      journalEntries[index] = { ...journalEntries[index], ...entryData };
      return journalEntries[index];
    }
    throw new Error("Journal entry not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = journalEntries.findIndex(entry => entry.Id === id);
    if (index !== -1) {
      journalEntries.splice(index, 1);
      return true;
    }
    throw new Error("Journal entry not found");
  }
};