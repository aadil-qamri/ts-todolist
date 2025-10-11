import './App.css'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { Slide } from 'react-toastify';
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
function App() {


  interface Todo {
    id: string;
    todo: string;
    isCompleted: boolean;
  }

  useEffect(() => {
    getData()
  }, [])


  const [todo, setTodo] = useState<string>("")
  const [showfinish, setshowFinish] = useState<boolean>(true)
  const [todos, setTodos] = useState<Todo[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const getData = async () => {
    let req = await fetch("http://localhost:5000/api/todos")
    let todoData = await req.json()
    setTodos(todoData)
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value)
  }

  const togglefinish = () => {
    setshowFinish(!showfinish)
  }



  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.name;
    // find the todo text in the previous state, set it into the input,
    // then remove the item from the list so the user can edit and re-add it
    setTodos(prev => {
      const itemToEdit = prev.find(item => item.id === id);
      if (itemToEdit) {
        setTodo(itemToEdit.todo);
      }
      return prev.filter(item => item.id !== id)
    });
  }

  const handleAdd = async () => {
    if (!todo.trim()) return;
    setIsAdding(true);

    // prepare optimistic item in case server doesn't return full object
    const optimisticItem: Todo = { id: uuidv4(), todo: todo.trim(), isCompleted: false };

    try {
      const res = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: optimisticItem.todo })
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const created = await res.json();
      // Merge server response with defaults to ensure `id` and `isCompleted` exist
      const itemToAdd: Todo = {
        id: (created && created.id) ? created.id : optimisticItem.id,
        todo: (created && created.todo) ? created.todo : optimisticItem.todo,
        isCompleted: (created && typeof created.isCompleted === 'boolean') ? created.isCompleted : optimisticItem.isCompleted,
      };
      setTodos(prev => [...prev, itemToAdd]);

      setTodo("");
      toast.success('Saved todo', {
        position: "top-right",
        autoClose: 1696,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    } catch (err) {
      // fallback: add optimistic item so user sees it (optional),
      // here we add optimistic so user isn't blocked
      setTodos(prev => [...prev, optimisticItem]);
      toast.error('Failed to save todo to server; added locally', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      console.error('Failed to POST todo:', err);
      setTodo("");
    } finally {
      setIsAdding(false);
    }
  }
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.name;
    if (!confirm("Are you sure ?")) return;

    // mark as deleting to disable the button
    setDeletingIds(prev => [...prev, id]);

    // keep a backup to allow revert on failure
    let removedItem: Todo | undefined;
    setTodos(prev => {
      const found = prev.find(item => item.id === id);
      removedItem = found;
      return prev.filter(item => item.id !== id);
    });

    try {
      const res = await fetch("http://localhost:5000/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      // success
      toast.warn('Removed todo', {
        position: "top-right",
        autoClose: 1696,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    } catch (err) {
      // revert optimistic remove
      if (removedItem) setTodos(prev => [removedItem as Todo, ...prev]);
      toast.error('Failed to delete todo', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      console.error('Failed to DELETE todo:', err);
    } finally {
      // remove from deleting list
      setDeletingIds(prev => prev.filter(x => x !== id));
    }
  }
  const handleCheck = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.name;

    // Optimistic update: flip locally
    setTodos(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));

    try {
      const res = await fetch("http://localhost:5000/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const updated = await res.json();
      if (updated && updated.result) {
        // sync with server response
        setTodos(prev => prev.map(item => item.id === id ? updated.result as Todo : item));
      }
    } catch (err) {
      // revert on error
      setTodos(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
      toast.error('Failed to update todo', { position: "top-right", autoClose: 2000 });
      toast.error('Failed to update todo', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      console.error('Failed to PATCH todo:', err);
    }
  }


  return (
    <>
      <div className=' my-6 mx-6 rounded-xl p-5 bg-green-200 min-h-[80vh]'>
        <h1 className='font-black text-3xl text-center'>iTask - manage all your todos in one place</h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className='text-lg font-bold'>Add a todo</h2>
          <input onChange={handleChange} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault(); // optional, prevents default behavior
              if (!todo.trim()) return; // ignore empty todos
              handleAdd(); // call your function to add the todo
              setTodo(""); // clear the input
            }
          }} value={todo} className='bg-white w-full rounded-lg px-5 py-2' type="text" placeholder='Enter a todo' />
          <button onClick={handleAdd} disabled={isAdding} className='cursor-pointer bg-green-700 hover:bg-green-800 p-3 py-1 text-sm font-semibold text-white  rounded-[15px] mx-6 '>{isAdding ? 'Saving...' : 'Save'}</button>
        </div>
        <input onChange={togglefinish} className='accent-green-600 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 cursor-pointer mr-2' type="checkbox" checked={showfinish} />Show Finished
        <h2 className='text-lg font-bold'>Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5 font-medium'>No Todos To display</div>}
          {todos.map((item) => {
            return (showfinish || !item.isCompleted) && <div key={item.id} className="todo flex md:w-1/2 justify-between my-3">
              <div className='flex items-center gap-5'>
                <input className='w-5 h-5 accent-green-600 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500  cursor-pointer' type="checkbox" checked={item.isCompleted} onChange={handleCheck} name={item.id} id="isComplete" />
                <div className={item.isCompleted ? 'line-through' : ""}>{item.todo}</div>
              </div>
              <div className="buttons flex h-full">
                <button name={item.id} onClick={handleEdit} className='cursor-pointer bg-green-700 hover:bg-green-800 p-3 py-1 text-sm font-semibold text-white  rounded-[15px] mx-2'><FaEdit /></button>
                <button name={item.id} onClick={handleDelete} disabled={deletingIds.includes(item.id)} className='cursor-pointer bg-green-700 hover:bg-green-800 p-3 py-1 text-sm font-semibold text-white  rounded-[15px] mx-2'>{deletingIds.includes(item.id) ? 'Deleting...' : <MdDelete />}</button>
              </div>
            </div>
          })}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1696}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </>
  )
}

export default App
