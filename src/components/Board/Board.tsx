"use client";
import { useState, useEffect } from "react";
import { Issue } from "@/lib/types";
import ItemDialog from "../ItemDialog/ItemDialog";
import Form from "../Form/Form";
import { LOCAL_TODO_KEY, LOCAL_DONE_KEY } from "@/lib/constants";

export default function Board() {
  const [todos, setTodos] = useState<Issue[]>([]);
  const [done, setDone] = useState<Issue[]>([]);
  const [selected, setSelected] = useState<Issue | null>(null);
  const [isDone, setIsDone] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedTodos = localStorage.getItem(LOCAL_TODO_KEY);
    const storedDone = localStorage.getItem(LOCAL_DONE_KEY);

    if (storedTodos) setTodos(JSON.parse(storedTodos));
    if (storedDone) setDone(JSON.parse(storedDone));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_TODO_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(LOCAL_DONE_KEY, JSON.stringify(done));
  }, [done]);

  function moveToDone(issue: Issue) {
    const now = new Date().toISOString();
    const updated = {
      ...issue,
      updated_time: now,
    };
    setTodos((prev) => prev.filter((i) => i !== issue));
    setDone((prev) => [...prev, updated]);
  }

  function addTodo(issue: Issue) {
    setTodos((prev) => [...prev, issue]);
  }

  function onCommentsChange(updatedComments: string[]) {
    if (!selected) return;

    const updatedIssue = {
      ...selected,
      comments: updatedComments,
      updated_time: new Date().toISOString(),
    };

    if (isDone) {
      setDone((prev) =>
        prev.map((issue) => (issue === selected ? updatedIssue : issue))
      );
    } else {
      setTodos((prev) =>
        prev.map((issue) => (issue === selected ? updatedIssue : issue))
      );
    }

    setSelected(updatedIssue);
  }

  function updateSuccessTime(newSuccessTime: string) {
    if (!selected) return;

    const updatedIssue = {
      ...selected,
      successTime: newSuccessTime,
      updated_time: new Date().toISOString(),
    };

    if (isDone) {
      setDone((prev) =>
        prev.map((issue) => (issue === selected ? updatedIssue : issue))
      );
    } else {
      setTodos((prev) =>
        prev.map((issue) => (issue === selected ? updatedIssue : issue))
      );
    }

    setSelected(updatedIssue);
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h2 className="font-semibold">TODO</h2>
        <ul className="space-y-2">
          {todos.map((issue, i) => (
            <li key={i} className="border p-2 cursor-pointer" onClick={() => {
                setSelected(issue);
                setIsDone(false);
              }}
            >
              {issue.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold">DONE</h2>
        <ul className="space-y-2">
          {done.map((issue, i) => (
            <li key={i} className="border p-2 cursor-pointer" onClick={() => {
                setSelected(issue);
                setIsDone(true);
              }}
            >
              {issue.name}
            </li>
          ))}
        </ul>
      </div>
      <Form onAdd={addTodo} />

      {selected && (
        <ItemDialog
          issue={selected}
          onClose={() => setSelected(null)}
          onDone={() => {
            moveToDone(selected);
            setSelected(null);
          }}
          isDone={isDone}
          onCommentsChange={onCommentsChange}
          onSuccessTimeChange={updateSuccessTime}
        />
      )}
    </div>
  );
}