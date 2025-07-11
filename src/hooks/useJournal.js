import { useState, useEffect } from "react";
import { journalService } from "@/services/api/journalService";
import { toast } from "react-toastify";

export const useJournal = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await journalService.getAll();
      setEntries(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load journal entries");
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entryData) => {
    try {
      const newEntry = await journalService.create(entryData);
      setEntries(prevEntries => [newEntry, ...prevEntries]);
      toast.success("Journal entry created successfully");
      return newEntry;
    } catch (err) {
      toast.error("Failed to create journal entry");
      throw err;
    }
  };

  const updateEntry = async (entryId, entryData) => {
    try {
      const updatedEntry = await journalService.update(entryId, entryData);
      setEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.Id === entryId ? updatedEntry : entry
        )
      );
      toast.success("Journal entry updated successfully");
      return updatedEntry;
    } catch (err) {
      toast.error("Failed to update journal entry");
      throw err;
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      await journalService.delete(entryId);
      setEntries(prevEntries => prevEntries.filter(entry => entry.Id !== entryId));
      toast.success("Journal entry deleted successfully");
    } catch (err) {
      toast.error("Failed to delete journal entry");
    }
  };

  const getEntriesByDate = async (date) => {
    try {
      const data = await journalService.getByDate(date);
      return data;
    } catch (err) {
      toast.error("Failed to load entries for date");
      return [];
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntriesByDate,
    refetch: loadEntries
  };
};