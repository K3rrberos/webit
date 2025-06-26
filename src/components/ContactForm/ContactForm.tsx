"use client";
import { useState, useEffect } from "react";

type Message = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [submittedMessages, setSubmittedMessages] = useState<Message[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({ name, email, message }),
    });
    if (res.ok) {
      setStatus("Message sent!");
      setSubmittedMessages(prev => [...prev, { name, email, message }]);
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setStatus("Failed to send message.");
    }
  }

  if (!hasMounted) return null; // Prevents server mismatch

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-sm">
        <input
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <textarea
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
        {status && <p className="text-sm text-gray-700">{status}</p>}
      </form>

      {/* Submitted Messages */}
      {submittedMessages.length > 0 && (
        <div className="bg-gray-50 p-4 rounded shadow-sm">
          <h3 className="font-semibold mb-2">Submitted Messages:</h3>
          <ul className="space-y-2">
            {submittedMessages.map((msg, idx) => (
              <li key={idx} className="border p-2 rounded bg-white shadow-sm">
                <p><strong>Name:</strong> {msg.name}</p>
                <p><strong>Email:</strong> {msg.email}</p>
                <p><strong>Message:</strong> {msg.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}