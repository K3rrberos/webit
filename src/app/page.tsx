import { Suspense } from "react";
import Board from "@/src/components/Board/Board";
import ContactForm from "@/src/components/ContactForm/ContactForm";

export default async function HomePage() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <section>
        <h1 className="text-xl font-bold mb-4">TODO App</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <Board />
        </Suspense>
      </section>
      <section>
        <h1 className="text-xl font-bold mb-4">Contact Form</h1>
        <ContactForm />
      </section>
    </main>
  );
}