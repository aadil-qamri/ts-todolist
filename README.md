# ✅ TypeScript Todo List

A clean, type-safe task manager built with **React** and **TypeScript** — focused on practicing static typing, component architecture, and state management.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)

## 🚀 Features

- ✏️ **Add Tasks** — Create new todo items
- ✅ **Complete Tasks** — Mark tasks as done
- 🗑️ **Delete Tasks** — Remove tasks from the list
- 🔷 **TypeScript** — Fully typed components, props, and state
- ⚛️ **React Hooks** — `useState` for local state management
- 🧩 **Component-Based** — Clean separation of concerns

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| State | React Hooks (useState) |
| Styling | CSS |
| Build Tool | Vite / Create React App |

## 🎯 What I Learned

This project was built to practice:
- Defining **TypeScript interfaces** for component props
- Typing **React state** (`useState<Type>()`)
- Typing **event handlers** (`React.ChangeEvent`, `React.FormEvent`)
- Building **reusable typed components**
- Managing **array state** (add, toggle, delete items)

## ⚙️ Getting Started

### Installation

```bash
git clone https://github.com/aadil-qamri/ts-todolist.git
cd ts-todolist
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
ts-todolist/
├── src/
│   ├── components/
│   │   ├── TodoItem.tsx    # Individual todo item component
│   │   ├── TodoList.tsx    # List of todos
│   │   └── AddTodo.tsx     # Input form component
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
└── public/
```

## 💡 Key TypeScript Patterns Used

```typescript
// Defining a Todo interface
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Typed component props
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

// Typed state
const [todos, setTodos] = useState<Todo[]>([]);
```

## 📄 License

[MIT](LICENSE)

---

Built with ❤️ by [Aadil Qamri](https://github.com/aadil-qamri)
