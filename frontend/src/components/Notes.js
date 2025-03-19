import React, { useContext, useEffect, useState, useRef } from 'react';
import noteContext from '../context/notes/NoteContext';
import NoteItem from './NoteItem';
import { useNavigate } from 'react-router-dom';
import Addnote from './Addnote';

const Notes = (props) => {
  const { notes, getNotes, editNote } = useContext(noteContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      getNotes();
    }
  }, [getNotes, navigate]);

  const modalRef = useRef(null);

  const [note, setNote] = useState({ id: '', etitle: '', edescription: '', etag: '', ecategory: '' });
  const [selectedCategory, setSelectedCategory] = useState("✨ All");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortCriteria, setSortCriteria] = useState("modifiedDate");
  const [sortOrder, setSortOrder] = useState("desc");


   // Sort the notes based on the selected criteria and order
   const sortedNotes = notes.sort((a, b) => {
    const dateA = new Date(a[sortCriteria] || a.date);
    const dateB = new Date(b[sortCriteria] || b.date);
    return sortOrder === "old" ? dateA - dateB : dateB - dateA;
  });

  const toggleModal = () => {
    modalRef.current.classList.toggle('hidden');
  };

  const determineCategory = (tag) => {
    for (const [category, tags] of Object.entries(categories)) {
      if (tags.includes(tag)) return category; // Return the correct category
    }
    return null; // Return `null` instead of an empty string or "✨ All"
  };

  const updateNote = (currentNote) => {
    const category = determineCategory(currentNote.tag);
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
      ecategory: category || "📚 General", // ✅ Set a default category instead of "✨ All"
    });

    modalRef.current.classList.toggle('hidden');
  };

  const handleClick = () => {
    editNote(note.id, note.etitle, note.edescription, note.etag);
    modalRef.current.classList.toggle('hidden');
    props.showAlert('Note updated successfully !', '#D4EDDA');
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "ecategory") {
      // When category changes, reset the tag to the first available tag in that category
      setNote({
        ...note,
        ecategory: value,
        etag: categories[value]?.[0] || "" // ✅ Auto-select first tag of category
      });
    } else {
      setNote({ ...note, [name]: value });
    }
  };

  // Category & Tag Data
  const categories = {
    "✨ All": [],
    "📚 General": ["General", "Note", "Task", "Ideas"],
    "📂 Work": ["Meetings", "Projects", "Work"],
    "🏡 Personal": ["Reading", "Poem", "Shayari", "Thought"],
    "💰 Future": ["Budgeting", "Future Plans", "Goals"]
  };

  return (
    <>
      <Addnote showAlert={props.showAlert} />

      {/* Modal */}
      <div
        ref={modalRef}
        className="hidden fixed top-0 left-0 z-50 w-full h-full backdrop-blur-sm bg-opacity-50 flex justify-center items-center"
      >
        <form className="bg-[#0a1122]  md:w-[60vw] max-w-[50rem] shadow-2xl rounded px-8 pt-6 pb-8 mb-4">
          {/* Title */}
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="etitle"
            >
              Title
            </label>
            <input
              id="etitle"
              name="etitle"
              type="text"
              value={note.etitle}
              className="shadow border rounded w-full py-2 px-3 text-black focus:outline-none"
              placeholder="Enter title"
              onChange={onChange}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="edescription"
            >
              Description
            </label>
            <textarea
              id="edescription"
              name="edescription"
              className="shadow border rounded w-full py-2 px-3 text-black focus:outline-none resize-none"
              placeholder="Enter description"
              value={note.edescription}
              onChange={onChange}
              rows="4"
            />
          </div>

          {/* Category Selector */}
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="ecategory"
            >
              Category
            </label>
            <select
              id="ecategory"
              name="ecategory"
              className="shadow border rounded w-full py-2 px-3 text-black focus:outline-none"
              value={note.ecategory || "📚 General"} // ✅ Set a fallback category
              onChange={onChange}
            >
              <option value="" disabled>Select Category</option>
              {Object.keys(categories)
                .filter(category => category !== "✨ All") // ✅ Remove "✨ All" from options
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

          {/* Tag Selector */}
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="etag">
              Tag
            </label>
            <select
              id="etag"
              name="etag"
              className="shadow border rounded w-full py-2 px-3 text-black focus:outline-none"
              value={note.etag}
              onChange={onChange}
            >
              <option value="">Select Tag</option>
              {categories[note.ecategory]?.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={toggleModal}
              type="button"
              className="text-gray-700 mx-3 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            >
              Close
            </button>
            <button
              type="button"
              className={`bg-[#FFD252] hover:bg-[#FDC116] text-white font-bold py-2 px-4 rounded ${note.etitle.length < 3 ||
                note.edescription.length < 3 ||
                note.etag.length < 1
                ? "cursor-not-allowed opacity-50"
                : ""
                }`}
              onClick={handleClick}
              disabled={
                note.etitle.length < 3 ||
                note.edescription.length < 3 ||
                note.etag.length < 1
              }
            >
              Edit Note
            </button>
          </div>
        </form>
      </div>

      {/* Notes Section */}
      <div className="bg-[#0A1122] p-4 rounded-xl shadow-lg">
        <h1 className="text-white text-3xl font-semibold mb-2">Your Notes</h1>

        {/* Category Selection */}
        {notes.length > 1 && (
          <div className="flex gap-2 mb-3 overflow-x-auto whitespace-nowrap scrollbar-hide px-0">
            {Object.keys(categories)
              .filter(category => category === "✨ All" || notes.some(note => categories[category].includes(note.tag)))
              .map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedTag(""); // Reset tag when category changes
                  }}
                  className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${selectedCategory === category
                    ? "bg-[#FFD252] text-black border-[#FFD252] shadow-md"
                    : "bg-[#1E293B] text-white border-gray-600 hover:border-white hover:bg-[#374151]"
                    }`}
                >
                  {category}
                </button>
              ))}
          </div>
        )}

        {/* Tag Selection (Subcategories) */}
        {categories[selectedCategory]?.length > 1 && notes.some(note => categories[selectedCategory].includes(note.tag)) && (
          <div className="flex gap-2 mb-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {categories[selectedCategory]
              .filter(tag => notes.some(note => note.tag === tag))
              .map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full border transition-all duration-300 ${selectedTag === tag
                    ? "bg-[#FFD252] text-black border-[#FFD252] shadow-md"
                    : "bg-[#1E293B] text-white border-gray-600 hover:border-white hover:bg-[#374151]"
                    }`}
                >
                  {tag}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Sorting Options */}
      <div className="flex gap-2 mb-3">
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          className="px-4 py-2 text-sm rounded-full border bg-[#1E293B] text-white border-gray-600 hover:border-white hover:bg-[#374151]"
        >
          <option value="modifiedDate">Modified Date</option>
          <option value="date">Created Date</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 text-sm rounded-full border bg-[#1E293B] text-white border-gray-600 hover:border-white hover:bg-[#374151]"
        >
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
        </select>
      </div>

      {/* Notes List */}
      <div className="flex flex-wrap text-white gap-3 mt-4">
        {notes
          .filter((note) => {
            if (selectedCategory !== "✨ All") {
              const categoryTags = categories[selectedCategory];
              if (!categoryTags.includes(note.tag)) return false;
            }
            if (selectedTag && note.tag !== selectedTag) return false;
            return true;
          })
          .map((note) => (
            <NoteItem key={note._id} showAlert={props.showAlert} updateNote={updateNote} note={note} />
          ))}

        {/* Show message if no notes are found */}
        {notes.filter((note) => {
          if (selectedCategory !== "✨ All") {
            const categoryTags = categories[selectedCategory];
            if (!categoryTags.includes(note.tag)) return false;
          }
          if (selectedTag && note.tag !== selectedTag) return false;
          return true;
        }).length === 0 && <p>No Notes To Display</p>}
      </div>
    </>
  );
};

export default Notes;