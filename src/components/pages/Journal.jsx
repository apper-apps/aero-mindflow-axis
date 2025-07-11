import { useState } from "react";
import { motion } from "framer-motion";
import { useJournal } from "@/hooks/useJournal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import JournalCard from "@/components/molecules/JournalCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const Journal = () => {
  const { entries, loading, error, createEntry, updateEntry, deleteEntry, refetch } = useJournal();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [formData, setFormData] = useState({
    type: "morning",
    content: "",
    mood: 3,
    tags: ""
  });

  const moodLabels = {
    1: "Very Bad",
    2: "Bad",
    3: "Okay",
    4: "Good",
    5: "Excellent"
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} />;
  }

  const filteredEntries = filterType === "all" 
    ? entries 
    : entries.filter(entry => entry.type === filterType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const entryData = {
        ...formData,
        date: new Date().toISOString(),
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
      };
      
      if (editingEntry) {
        await updateEntry(editingEntry.Id, entryData);
      } else {
        await createEntry(entryData);
      }
      
      setShowForm(false);
      setEditingEntry(null);
      setFormData({
        type: "morning",
        content: "",
        mood: 3,
        tags: ""
      });
    } catch (err) {
      console.error("Failed to save entry:", err);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      type: entry.type,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags ? entry.tags.join(", ") : ""
    });
    setShowForm(true);
  };

  const handleDelete = async (entryId) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      await deleteEntry(entryId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Journal</h1>
          <p className="text-gray-400 mt-1">
            Reflect on your day and plan for tomorrow
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Entry
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={formData.type === "morning" ? "primary" : "secondary"}
          onClick={() => {
            setFormData({ ...formData, type: "morning" });
            setShowForm(true);
          }}
        >
          <ApperIcon name="Sunrise" size={16} className="mr-2" />
          Morning Planning
        </Button>
        <Button
          variant={formData.type === "evening" ? "primary" : "secondary"}
          onClick={() => {
            setFormData({ ...formData, type: "evening" });
            setShowForm(true);
          }}
        >
          <ApperIcon name="Moon" size={16} className="mr-2" />
          Evening Reflection
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              {editingEntry ? "Edit Entry" : "New Journal Entry"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Entry Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-gray-100 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    <option value="morning">Morning Planning</option>
                    <option value="evening">Evening Reflection</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mood (1-5)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.mood}
                      onChange={(e) => setFormData({ ...formData, mood: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-300 min-w-[80px]">
                      {moodLabels[formData.mood]}
                    </span>
                  </div>
                </div>
              </div>
              
              <FormField
                label="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={
                  formData.type === "morning" 
                    ? "What are your intentions for today? What do you want to focus on?"
                    : "How was your day? What did you accomplish? What are you grateful for?"
                }
                multiline
                rows={6}
                required
              />
              
              <FormField
                label="Tags (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., productivity, gratitude, goals"
              />
              
              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" variant="primary">
                  {editingEntry ? "Update Entry" : "Save Entry"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEntry(null);
                    setFormData({
                      type: "morning",
                      content: "",
                      mood: 3,
                      tags: ""
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType("all")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterType === "all"
              ? "bg-primary text-white"
              : "bg-surface text-gray-300 hover:text-white"
          }`}
        >
          All ({entries.length})
        </button>
        <button
          onClick={() => setFilterType("morning")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterType === "morning"
              ? "bg-accent text-white"
              : "bg-surface text-gray-300 hover:text-white"
          }`}
        >
          Morning ({entries.filter(e => e.type === "morning").length})
        </button>
        <button
          onClick={() => setFilterType("evening")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterType === "evening"
              ? "bg-secondary text-white"
              : "bg-surface text-gray-300 hover:text-white"
          }`}
        >
          Evening ({entries.filter(e => e.type === "evening").length})
        </button>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <Empty
          title="No journal entries yet"
          description="Start your journaling journey by writing your first entry. Reflect on your day and plan for tomorrow."
          action="Write Your First Entry"
          onAction={() => setShowForm(true)}
          icon="BookOpen"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {filteredEntries.map((entry) => (
            <JournalCard
              key={entry.Id}
              entry={entry}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Journal;