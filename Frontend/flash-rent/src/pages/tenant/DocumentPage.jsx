import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Pagination from "../../components/Pagination";
import SearchInput from "../../components/SearchInput";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import { usePagination } from "../../hooks/usePagination";
import { useToken } from "../../hooks/useToken";


export default function DocumentPage() {
    const [documents, setDocuments] = useState([]);
    const [currentPage, totalPages, handlePageChange, displayedItems] = usePagination({ items: documents });
    const {token} = useToken();

    useEffect(() => {
        axios.get('http://localhost:8000/api/documents/', {
            headers: {
                'Authorization': `token ${token}`
            }
        })
            .then(response => {
                setDocuments(response.data);
            })
            .catch(error => {
                console.error("Error fetching documents:", error);
            });
    }, [currentPage]);

    return (
        <AuthenticatedLayout>
            <section className="p-3 sm:p-5">
                <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                    <div className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 relative pb-3 shadow-md rounded-lg overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                            <div className="w-full md:w-1/2">
                                <SearchInput placeholder="Search for documents" />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">
                                            Document Name
                                        </th>
                                        <th scope="col" className="px-4 py-3">
                                            Publication Date
                                        </th>
                                        <th scope="col" className="px-4 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedItems.map((document) => (
                                        <tr key={document.id} className="border-b dark:border-gray-700">
                                            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {document.name}
                                            </th>
                                            <td className="px-4 py-3">
                                                {new Date(document.publication_date).toLocaleDateString()}
                                            </td>
                                            <Menu>
                                                <td className="px-4 py-3 flex items-center justify-end">
                                                    <MenuButton className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        </svg>
                                                    </MenuButton>
                                                    <MenuItems anchor="bottom">
                                                        <div className="bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                                                <MenuItem>
                                                                    <Link
                                                                        to={`/documents/${document.id}/view`}
                                                                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                    >
                                                                        View
                                                                    </Link>
                                                                </MenuItem>
                                                                <MenuItem>
                                                                    <a
                                                                        href={document.file}
                                                                        download={document.name}
                                                                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                    >
                                                                        Download
                                                                    </a>
                                                                </MenuItem>
                                                            </ul>
                                                        </div>
                                                    </MenuItems>
                                                </td>
                                            </Menu>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}

