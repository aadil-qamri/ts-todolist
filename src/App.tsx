import './App.css'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { Slide } from 'react-toastify';
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
function App() {

  const [todo, setTodo] = useState<string>("")
  const [showfinish, setshowFinish] = useState<boolean>(true)
  const [todos, setTodos] = useState<{ id: string; todo: string; isCompleted: boolean }[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });


  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);



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
  const handleAdd = () => {
    if (!todo.trim()) return
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
    setTodo("")
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
  }
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    let id = e.currentTarget.name
    confirm("Are you sure ?")
    setTodos(prev => prev.filter(item => item.id !== id));
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

  }
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    let id = e.target.name
    setTodos(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
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
          <button onClick={handleAdd} className='cursor-pointer bg-green-700 hover:bg-green-800 p-3 py-1 text-sm font-semibold text-white  rounded-[15px] mx-6 '>Save</button>
        </div>
        <input onChange={togglefinish} className='accent-green-600 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 cursor-pointer mr-2' type="checkbox" checked={showfinish} />Show Finished
        <h2 className='text-lg font-bold'>Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5 font-medium'>No Todos To display</div>}
          {todos.map((item, index) => {
            return (showfinish || !item.isCompleted) && <div key={index} className="todo flex md:w-1/2 justify-between my-3">
              <div className='flex items-center gap-5'>
                <input className='w-5 h-5 accent-green-600 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500  cursor-pointer' type="checkbox" checked={item.isCompleted} onChange={handleCheck} name={item.id} id="isComplete" />
                <div className={item.isCompleted ? 'line-through' : ""}>{item.todo}</div>
              </div>
              <div className="buttons flex h-full">
                <button name={item.id} onClick={handleEdit} className='cursor-pointer bg-green-700 hover:bg-green-800 p-3 py-1 text-sm font-semibold text-white  rounded-[15px] mx-2'><FaEdit /></button>
                <button name={item.id} onClick={handleDelete} className='cursor-pointer bg-green-700 hover:bg-green-800 p-3 py-1 text-sm font-semibold text-white  rounded-[15px] mx-2'><MdDelete /></button>
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
