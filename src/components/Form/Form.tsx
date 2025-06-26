"use client";
import { useState, useEffect } from "react";
import { Issue } from "@/lib/types";
import { LOCAL_TODO_KEY } from "@/lib/constants";

export default function Form({ onAdd }: { onAdd: (issue: Issue) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newIssue: Issue = {
      id: crypto.randomUUID(),
      name,
      description,
      estimated_time: estimatedTime,
      created_time: new Date().toISOString(),
      updated_time: new Date().toISOString(),
    };

    onAdd(newIssue);

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem(LOCAL_TODO_KEY) || "[]");
    localStorage.setItem(LOCAL_TODO_KEY, JSON.stringify([...existing, newIssue]));

    // Clear form
    setName("");
    setDescription("");
    setEstimatedTime("");
  }

  if (!hasMounted) return null; // Prevents server mismatch

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 border rounded mb-4">
      <h2 className="font-semibold">Create New TODO</h2>
      <input
        className="w-full border p-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        className="w-full border p-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        className="w-full border p-2"
        placeholder="Estimated Time (e.g. 2h)"
        value={estimatedTime}
        onChange={(e) => setEstimatedTime(e.target.value)}
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
        Add TODO
      </button>
    </form>
  );
}