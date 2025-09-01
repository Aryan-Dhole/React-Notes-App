import { useState, useEffect, useRef } from 'react'

function App() {

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : []
  })

  //editing
  const [editingIndex, setEditingIndex] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")


  const contentRef = useRef(null);
  const editContentRef = useRef(null);

  useEffect(() => {
    if (editContentRef.current) {
      editContentRef.current.style.height = "auto";
      editContentRef.current.style.height = editContentRef.current.scrollHeight + "px";
    }
  }, [editContent, editingIndex]);


  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])



  const saveEdit = (index) => {
    const updatedNotes = notes.map((n, i) =>
      i === index ? { ...n, title: editTitle, content: editContent } : n
    );
    setNotes(updatedNotes);
    setEditingIndex(null);
    setEditTitle("");
    setEditContent("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditTitle("");
    setEditContent("");
  };


  const addNote = () => {
    if (!title.trim() && !content.trim()) return;
    const newNote = { title, content }
    setNotes([newNote, ...notes])
    setTitle("")
    setContent("")
  }


  const deleteNote = (id) => {
    setNotes(notes.filter((_, index) => index !== id))
  }

  return (
    <>
      <div className='min-h-screen bg-gray-900 text-white p-12'>
        <h1 className='text-3xl font-bold text-center mb-16'>📝Notes App</h1>
        <div className='flex flex-col items-center gap-y-4 mb-16'>
          <input type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter Note Title...'
            className='px-4 py-2 w-100 rounded-md bg-gray-800 text-white'
          />
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              // auto height
              const el = contentRef.current;
              el.style.height = "auto"; // reset
              el.style.height = el.scrollHeight + "px"; // set new
            }}
            placeholder="Enter Content..."
            className="px-4 py-2 w-120 rounded-md bg-gray-800 text-white resize-none overflow-hidden"
          />

          <button
            onClick={addNote}
            className='bg-violet-600 w-70 px-6 py-2 rounded-2xl'
          >
            Add
          </button>
        </div>
        <h1 className='text-sm italic text-center mb-4 text-gray-400'>Your Notes will appear below! </h1>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {
            notes.map((note, index) => (
              <div key={index}
                className='bg-gray-800 p-4 rounded-2xl shadow hover:shadow-lg transition'>
                {editingIndex === index ? (
                  <div className="flex flex-col gap-2 flex-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="px-2 py-1 rounded bg-gray-700 text-white outline-none"
                      autoFocus
                    />
                    <textarea
                      ref={editContentRef}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="px-2 py-1 rounded bg-gray-700 text-white outline-none resize-none overflow-hidden"
                    />

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => saveEdit(index)}
                        className="bg-green-600 px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEdit()}
                        className="bg-gray-600 px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="font-bold mb-2">{note.title}</h2>
                    <button
                      onClick={() => {
                        setEditingIndex(index)
                        setEditTitle(note.title)
                        setEditContent(note.content)
                      }}
                      className='mr-2 bg-gray-600 w-8 h-8 rounded-full hover:bg-gray-500 mb-4'
                      title='Edit Note'>
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteNote(index)}
                      className="text-red-500 bg-gray-600 w-8 h-8 rounded-full hover:text-red-700 hover:bg-gray-500 mb-4"
                      title="Delete Note"
                    >
                      ❌
                    </button>
                    <p className='text-gray-100'>{note.content}</p>
                  </>
                )}


              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default App
