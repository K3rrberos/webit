"use client";
import { Issue } from "@/lib/types";
import { useState, useEffect } from "react";

type ItemDialogProps = {
  issue: Issue & { comments?: string[]; successTime?: string };
  onClose: () => void;
  onDone: () => void;
  isDone: boolean | Issue;
  onCommentsChange: (comments: string[]) => void;
  onSuccessTimeChange?: (successTime: string) => void; // optional callback
  onUploadSuccessTime?: (successTime: string) => void;
};

export default function ItemDialog({
  issue,
  onClose,
  onDone,
  isDone,
  onCommentsChange,
  onSuccessTimeChange,
  onUploadSuccessTime,
}: ItemDialogProps) {
  // Initialize comments array from issue.comments or empty array
  const [comments, setComments] = useState<string[]>(issue.comments || []);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [successTime, setSuccessTime] = useState<string>(issue.successTime || "");
  const [tempSuccessTime, setTempSuccessTime] = useState<string>("");

  const localStorageKey = `successTime-${issue.id}`;

  // Sync comments if issue.comments changes externally
  useEffect(() => {
    setComments(issue.comments || []);
  }, [issue.comments]);

  useEffect(() => {
    const stored = localStorage.getItem(localStorageKey);
    const time = stored || issue.successTime || "";
    setSuccessTime(time);
    setTempSuccessTime(""); // clears input when dialog opens
  }, [issue.id]);

  function handlePostComment() {
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    const updatedComments = [...comments, newComment.trim()];
    setComments(updatedComments);
    setNewComment("");
    setError("");

    // Inform parent
    onCommentsChange(updatedComments);
  }

  function handleUploadSuccessTime() {
    const trimmedTime = tempSuccessTime.trim();
    if (!trimmedTime) return;

    if (onUploadSuccessTime) {
      onUploadSuccessTime(trimmedTime);
    }

    if (onSuccessTimeChange) {
      onSuccessTimeChange(trimmedTime);
    }

    // Save per-issue
    localStorage.setItem(localStorageKey, trimmedTime);

    // Update the local state so useEffect won't re-sync stale data
    setSuccessTime(trimmedTime);
    // Clear the input
    setTempSuccessTime("");
  }

  return (
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
      <h3 className="font-bold text-xl mb-2">{issue.name}</h3>
      <p className="mb-2">{issue.description}</p>
      <div className="text-sm text-gray-500 space-y-1 mb-4">
        <p>
          <strong>Created:</strong> {formatDate(issue.created_time)}
        </p>
        <p>
          <strong>Updated:</strong> {formatDate(issue.updated_time)}
        </p>
        <p>
          <strong>Estimated:</strong> {issue.estimated_time}
        </p>

        <div className="flex items-center gap-3">
          <p>
            <strong>Success Time:</strong>{" "}
            {successTime || <span className="italic text-gray-400">Not set</span>}
          </p>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1.5 rounded text-xs ml-5"
            onClick={handleUploadSuccessTime}
            disabled={!tempSuccessTime.trim()}
          >
            Upload Success Time
          </button>
        </div>

        <div className="mt-4">
          <strong>Comments:</strong>
          {comments.length === 0 && <p className="text-gray-400 italic">No comments yet.</p>}
          <ul className="list-disc ml-5 max-h-40 overflow-y-auto">
            {comments.map((c, i) => (
              <li key={i} className="mb-1">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="successTime" className="block font-semibold mb-1">
          Success Time (e.g. 2h 30m):
        </label>
        <input
          id="successTime"
          type="text"
          className="w-full border rounded p-2"
          placeholder="Enter time it took to complete"
          value={tempSuccessTime}
          onChange={(e) => setTempSuccessTime(e.target.value)}
        />
      </div>

      <textarea
        className="w-full border rounded p-2"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handlePostComment}
          disabled={!newComment.trim()}
        >
          Post Comment
        </button>

        <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded" onClick={onClose}>
          Close
        </button>

        {!isDone && (
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" onClick={onDone}>
            Mark as Done
          </button>
        )}
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // months are zero-indexed
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}