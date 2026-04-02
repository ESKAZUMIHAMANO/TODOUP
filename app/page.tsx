"use client";

import { useState, useRef } from "react";

type Task = {
  id: string;
  text: string;
  done: boolean;
  createdAt: Date;
};

function CheckIcon({ done }: { done: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="10"
        cy="10"
        r="9"
        stroke={done ? "#6366f1" : "#d1d5db"}
        strokeWidth="1.5"
        fill={done ? "#6366f1" : "transparent"}
      />
      {done && (
        <path
          d="M6 10l3 3 5-5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 4h12M6 4V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V4M5 4l.5 8.5a.5.5 0 00.5.5h4a.5.5 0 00.5-.5L11 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="8"
        y1="7"
        x2="8"
        y2="11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        text,
        done: false,
        createdAt: new Date(),
      },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const doneCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;

  return (
    <main className="min-h-screen flex flex-col items-center py-16 px-4">
      {/* ヘッダー */}
      <div className="w-full max-w-lg mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
          ToDoリスト
        </h1>
        {totalCount > 0 && (
          <p className="text-sm text-gray-400">
            {doneCount} / {totalCount} 件完了
          </p>
        )}
      </div>

      {/* 入力フォーム */}
      <div className="w-full max-w-lg mb-6">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && addTask()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          <button
            onClick={addTask}
            disabled={!input.trim()}
            className="px-5 py-3 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            追加
          </button>
        </div>
      </div>

      {/* フィルター */}
      {totalCount > 0 && (
        <div className="w-full max-w-lg mb-4 flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(
            [
              { key: "all", label: "すべて" },
              { key: "active", label: "未完了" },
              { key: "done", label: "完了済み" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* タスクリスト */}
      <div className="w-full max-w-lg flex flex-col gap-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            {tasks.length === 0 ? (
              <>
                <div className="text-4xl mb-3">✏️</div>
                <p>タスクを追加してみましょう</p>
              </>
            ) : (
              <p>該当するタスクがありません</p>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="task-enter flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              {/* チェックボタン */}
              <button
                onClick={() => toggleTask(task.id)}
                className="flex-shrink-0 transition-transform active:scale-90"
                aria-label={task.done ? "未完了に戻す" : "完了にする"}
              >
                <CheckIcon done={task.done} />
              </button>

              {/* タスクテキスト */}
              <span
                className={`flex-1 text-sm leading-relaxed transition-colors ${
                  task.done
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {task.text}
              </span>

              {/* 削除ボタン */}
              <button
                onClick={() => deleteTask(task.id)}
                className="flex-shrink-0 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                aria-label="削除"
              >
                <TrashIcon />
              </button>
            </div>
          ))
        )}
      </div>

      {/* 完了済みをまとめて削除 */}
      {doneCount > 0 && (
        <div className="w-full max-w-lg mt-6 flex justify-end">
          <button
            onClick={() => setTasks((prev) => prev.filter((t) => !t.done))}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            完了済みをすべて削除 ({doneCount}件)
          </button>
        </div>
      )}
    </main>
  );
}
