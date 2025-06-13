"use client";

import { useEffect, useState, Fragment } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";

// Definição do tipo Popup
interface Popup {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    showOnce: boolean;
}

export default function PopupManager() {
    const [popups, setPopups] = useState<Popup[]>([]);
    const [currentPopup, setCurrentPopup] = useState<Popup | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchPopups = async () => {
            try {
                const response = await fetch("/api/popups");

                if (!response.ok) {
                    throw new Error("Falha ao buscar popups");
                }

                const data: Popup[] = await response.json();

                if (data.length > 0) {
                    setPopups(data);

                    // Verificar quais popups já foram vistos (para os que são showOnce)
                    const viewedPopups = localStorage.getItem("viewedPopups");
                    const viewedPopupIds = viewedPopups ? JSON.parse(viewedPopups) : [];

                    // Filtrar popups que o usuário não viu ainda (se showOnce for true)
                    const popupsToShow = data.filter((popup) => !popup.showOnce || !viewedPopupIds.includes(popup.id));

                    if (popupsToShow.length > 0) {
                        setCurrentPopup(popupsToShow[0]);
                        setShowPopup(true);
                    }
                }
            } catch (err) {
                console.error("Erro ao buscar popups:", err);
            }
        };

        fetchPopups();
    }, []);

    const closePopup = () => {
        if (currentPopup?.showOnce) {
            // Salvar ID do popup no localStorage para não exibir novamente
            const viewedPopups = localStorage.getItem("viewedPopups");
            const viewedPopupIds = viewedPopups ? JSON.parse(viewedPopups) : [];

            if (!viewedPopupIds.includes(currentPopup.id)) {
                viewedPopupIds.push(currentPopup.id);
                localStorage.setItem("viewedPopups", JSON.stringify(viewedPopupIds));
            }
        }

        setShowPopup(false);

        // Verificar se há mais popups para exibir
        setTimeout(() => {
            const viewedPopups = localStorage.getItem("viewedPopups");
            const viewedPopupIds = viewedPopups ? JSON.parse(viewedPopups) : [];

            const nextPopups = popups.filter((popup) => !popup.showOnce || !viewedPopupIds.includes(popup.id));

            if (nextPopups.length > 0 && nextPopups[0].id !== currentPopup?.id) {
                setCurrentPopup(nextPopups[0]);
                setShowPopup(true);
            } else {
                setCurrentPopup(null);
            }
        }, 300);
    };

    if (!currentPopup) {
        return null;
    }

    return (
        <Transition appear show={showPopup} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closePopup}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <button
                                    onClick={closePopup}
                                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                                >
                                    {currentPopup.title}
                                </Dialog.Title>

                                {currentPopup.imageUrl && (
                                    <div className="mt-4 relative h-48 w-full">
                                        <Image
                                            src={currentPopup.imageUrl}
                                            alt={currentPopup.title}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                )}

                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{currentPopup.content}</p>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <Button variant="outline" size="sm" onClick={closePopup}>
                                        Fechar
                                    </Button>

                                    {currentPopup.buttonText && currentPopup.buttonUrl && (
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                closePopup();
                                                window.location.href = currentPopup.buttonUrl!;
                                            }}
                                        >
                                            {currentPopup.buttonText}
                                        </Button>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
