import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export async function getServerSideProps({params}) {
  const { bookId } = params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}`);
  const data = await response.json();

  return {
    props: {
      book: data,
    }
  }
};

const BookEdit = ({ book }) => {
  const router = useRouter();
  const [input, setInput] = useState(book.title);
  const [message, setMessage] = useState({
    msg: "",
    color: "none",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${book.id}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ 
        title: input,
        _method: "PATCH",
      }),
    });

    if (response.ok) {
      setMessage({
        ...message,
        msg: "Libro actualizado correctamente",
        color: "green",
      });
      setInput("");
      return router.push("/libros");
    };

    const data = await response.json();
    setMessage({
      ...message,
      msg: data.errors.title,
      color: "red",
    });
    setSubmitting(false);
  };

  return (
    <>
      <h1>Book Edit</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Título del libro"
          disabled={submitting}
          data-cy="input-book-title"
        />
        <button 
          disabled={submitting}
          data-cy="button-submit-book"
        >
          {submitting ? "Enviando...." : "Editar"}
        </button>
        <span style={{ color: message.color, display: "block" }}>{message.msg}</span>
      </form>
      <br />
      <Link href="/libros">Book List</Link>
    </>
  );
};

export default BookEdit;
