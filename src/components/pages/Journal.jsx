import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { entries, loading, error, createEntry, updateEntry, deleteEntry, refetch } = useJournal();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filterType, setFilterType] = useState("all");
const [formData, setFormData] = useState({
    type: "morning",
    content: "",
    mood: 3,
    tags: "",
    image: null
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

const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null });
  };

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
        tags: "",
        image: null
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
      tags: entry.tags ? entry.tags.join(", ") : "",
      image: entry.imageUrl || null
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
          <h1 className="text-3xl font-bold text-gray-100">{t('journal.title')}</h1>
          <p className="text-gray-400 mt-1">
            {t('journal.subtitle')}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {t('journal.new_entry')}
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
          {t('journal.morning_planning')}
        </Button>
        <Button
          variant={formData.type === "evening" ? "primary" : "secondary"}
          onClick={() => {
            setFormData({ ...formData, type: "evening" });
            setShowForm(true);
          }}
        >
          <ApperIcon name="Moon" size={16} className="mr-2" />
          {t('journal.evening_reflection')}
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
              {editingEntry ? t('journal.edit_entry') : t('journal.new_journal_entry')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('journal.entry_type')}
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
>
                    <option value="morning">{t('journal.morning_planning')}</option>
                    <option value="evening">{t('journal.evening_reflection')}</option>
                  </select>
                </div>
                
<div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('journal.mood')} (1-5)
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
                      {t(`journal.mood_labels.${formData.mood}`)}
                    </span>
                  </div>
                </div>
              </div>
              
<FormField
                label={t('journal.content')}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
placeholder={
                  formData.type === "morning" 
                    ? t('journal.morning_placeholder')
                    : t('journal.evening_placeholder')
                }
                multiline
                rows={6}
                required
              />
              
<FormField
                label={t('journal.tags')}
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder={t('journal.tags_placeholder')}
              />
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Picture (Optional)
                </label>
                {formData.image ? (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <img
                        src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <ApperIcon name="X" size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                    <ApperIcon name="Upload" size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400 mb-2">Upload a picture for your journal entry</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-surface hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" variant="primary">
                  {editingEntry ? t('journal.update_entry') : t('journal.save_entry')}
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
                      tags: "",
                      image: null
                    });
                  }}
                >
                  {t('common.cancel')}
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
          {t('common.all')} ({entries.length})
        </button>
        <button
          onClick={() => setFilterType("morning")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterType === "morning"
              ? "bg-accent text-white"
              : "bg-surface text-gray-300 hover:text-white"
          }`}
>
          {t('common.morning')} ({entries.filter(e => e.type === "morning").length})
        </button>
        <button
          onClick={() => setFilterType("evening")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterType === "evening"
              ? "bg-secondary text-white"
              : "bg-surface text-gray-300 hover:text-white"
          }`}
>
          {t('common.evening')} ({entries.filter(e => e.type === "evening").length})
        </button>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
<Empty
          title={t('journal.no_entries')}
          description={t('journal.no_entries_desc')}
          action={t('journal.write_first')}
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