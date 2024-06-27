import { useParams } from "react-router-dom";
import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";
import ChatInput from "../../../components/ChatInput";

export default function ChatArea() {
    const { userId } = useParams();
    const user = {
        id: userId,
        name: "Alice",
    };
  return (
    <AuthenticatedLayout>
        <section className="flex h-screen overflow-hidden shadow-md rounded-lg w-full">
            <div className="w-full bg-white dark:bg-gray-800 border-r border-gray-300 relative">
                <header className="p-4 border-b border-gray-300 flex justify-between items-center shadow-md bg-gray-600 text-white">
                    <h1 className="text-2xl font-semibold">{user.name}</h1>
                </header>
                <div className="h-full overflow-y-auto p-4 pb-36">
                    <div className="flex mb-4 cursor-pointer">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                            <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" className="w-8 h-8 rounded-full"/>
                        </div>
                        <div className="flex max-w-96 bg-gray-200 rounded-lg p-3 gap-3">
                            <p className="text-gray-700">Hey Bob, how's it going?</p>
                        </div>
                    </div>
                    <div className="flex justify-end mb-4 cursor-pointer">
                        <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                            <p>Hi Alice! I'm good, just finished a great book. How about you?</p>
                        </div>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                            <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar" className="w-8 h-8 rounded-full"/>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 w-full border-t border-gray-300 bg-gray-100 dark:bg-gray-800 p-4">
                    <ChatInput />
                </div>
            </div>
        </section>
    </AuthenticatedLayout>
  );
};

