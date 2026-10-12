import React from 'react';

export const Pagination = ({ currentPage, totalPages, totalElements, pageSize, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <div>
        Showing page {currentPage + 1} of {totalPages} ({totalElements} total items)
      </div>
      <div className="pagination-controls">
        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
