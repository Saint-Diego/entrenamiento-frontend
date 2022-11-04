import Link from "next/link";

export async function getStaticProps() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`);
  const data = await response.json();

  return {
    props: {
      books: data,
    }
  };
}

const BookList = ({ books }) => {

  const handleDelete = async (e, id) => {
    e.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ 
        _method: "DELETE",
      }),
    });

    if (response.ok) {
      window.location.href = "/libros";
    }
  }

  return (
    <div>
      <h1>Libros</h1>
      <ul data-cy="books-list">
        {books.map(({id, title}) => (
          <li key={`book-${id}`}>
            <Link 
              href={`/libros/${id}`}
              data-cy={`link-to-visit-book-${id}`}
            >
              {title}
            </Link>
            {' - '}
            <Link 
              href={`/libros/${id}/editar`}
              data-cy={`link-to-edit-book-${id}`}
            >
              Editar</Link>
            {' - '}
            <form style={{display: "inline"}} onSubmit={(e) => handleDelete(e, id)}>
              <button
                data-cy={`link-to-delete-book-${id}`}
              >
                Eliminar
              </button>
            </form>
          </li>
        ))}
      </ul>
      <Link href="/libros/crear">Create Book</Link>
    </div>
  );
};

export default BookList;
