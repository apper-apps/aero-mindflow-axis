import journalData from "@/services/mockData/journal.json";

let journalEntries = [...journalData];
let imageStorage = new Map(); // Simple storage for images in development
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
    const newId = Math.max(...journalEntries.map(e => e.Id)) + 1;
    
    let imageUrl = null;
    if (entryData.image) {
      // In a real app, you would upload to cloud storage
      // For now, we'll create a mock URL and store the file reference
      imageUrl = `mock-image-${newId}-${Date.now()}`;
      imageStorage.set(imageUrl, entryData.image);
    }
    
    const newEntry = {
      ...entryData,
      Id: newId,
      createdAt: new Date().toISOString(),
      imageUrl: imageUrl
    };
    delete newEntry.image; // Remove file object from stored data
    journalEntries.push(newEntry);
    return newEntry;
  },

async update(id, entryData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = journalEntries.findIndex(entry => entry.Id === id);
    if (index !== -1) {
      let imageUrl = journalEntries[index].imageUrl;
      
      if (entryData.image) {
        // Handle new image upload
        imageUrl = `mock-image-${id}-${Date.now()}`;
        imageStorage.set(imageUrl, entryData.image);
      } else if (entryData.image === null) {
        // Remove image
        if (imageUrl) {
          imageStorage.delete(imageUrl);
        }
        imageUrl = null;
      }
      
      const updatedData = { ...entryData };
      delete updatedData.image; // Remove file object
      updatedData.imageUrl = imageUrl;
      
      journalEntries[index] = { ...journalEntries[index], ...updatedData };
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