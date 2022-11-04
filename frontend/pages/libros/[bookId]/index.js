import Link from "next/link";

export async function getStaticProps({ params }) {
  const {bookId} = params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}`);
  const data = await response.json();

  return {
    props: {
      book: data,
    },
  };
}

export async function getStaticPaths() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`);
  const data = await response.json();

  return {
    paths: data.map(({ id }) => ({ params: { bookId: String(id) } })),
    fallback: false,
  };
}

const BookDetail = ({ book }) => {
  return (
    <>
      <h1>{book.title}</h1>
      <Link href="/libros">Book List</Link>
    </>
  );
};

export default BookDetail;
