import { useNavigate } from "react-router-dom";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";

export default function TenantTalk() {
    const navigate = useNavigate();

    const users = [
        { id: 1, name: "Alice", lastMessage: "Hoorayy!!", lastMessageTime: "5:09 PM 6/24/24" },
    ];

    const handleUserClick = (user) => {
        navigate(`/tenant/tenant-talk/${user.id}`);
    };

    return (
        <AuthenticatedLayout>
            <section className="flex h-screen overflow-hidden shadow-md rounded-lg">
                <div className="w-full bg-white dark:bg-gray-800 border-r border-gray-300">
                    <header className="p-4 border-b border-gray-300 flex justify-between items-center shadow-md bg-gray-600 text-white">
                        <h1 className="text-2xl font-semibold">Tenant Talk</h1>
                    </header>
                    <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
                        {users.map((user) => (
                        <div key={user.id} onClick={() => handleUserClick(user)} className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md">
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                                <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" className="w-12 h-12 rounded-full"/>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold dark:text-white">{user.name}</h2>
                                <p className="text-gray-600 dark:text-gray-100">{user.lastMessage}</p>
                            </div>
                            <div className="flex-end">
                                <p className="text-gray-600 dark:text-gray-100">{user.lastMessageTime}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
  );
};
