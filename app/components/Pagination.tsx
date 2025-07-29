type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: any;
};

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  if (
    !currentPage ||
    isNaN(currentPage) ||
    currentPage < 1 ||
    currentPage > totalPages
  ) {
    return <p>Page not found</p>;
  }

  return (
    <div className='flex justify-center gap-2 mt-8'>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={`px-3 py-1 cursor-pointer rounded ${
            currentPage === index + 1
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200'
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
