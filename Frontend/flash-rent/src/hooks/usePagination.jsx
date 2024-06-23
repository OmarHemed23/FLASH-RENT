import { useState } from "react";

export const usePagination = ({ items = [{}] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedItems = items.slice(startIndex, startIndex + itemsPerPage);

    return [currentPage, totalPages, handlePageChange, displayedItems];
};
