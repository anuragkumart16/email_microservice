'use client'

import React, { useState, useEffect } from 'react'
import { MdDelete, MdEdit, MdAdd, MdContentCopy, MdCheckCircle, MdWarning } from "react-icons/md";
import { IoMdRefresh, IoMdLogOut } from "react-icons/io";
import { FaServer, FaKey } from "react-icons/fa";

interface App {
    id: string;
    name: string;
    description: string | null;
    hashid: string;
}

interface ConfirmAction {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    danger?: boolean;
}

function Page() {
    const [apps, setApps] = useState<App[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Create App State
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [appName, setAppName] = useState("")
    const [appDesc, setAppDesc] = useState("")

    // Edit state
    const [editingApp, setEditingApp] = useState<App | null>(null)
    const [editName, setEditName] = useState("")
    const [editDesc, setEditDesc] = useState("")

    // Token Modal state
    const [createdToken, setCreatedToken] = useState<string | null>(null)
    const [showTokenModal, setShowTokenModal] = useState(false)
    const [copied, setCopied] = useState(false)

    // Confirmation Modal state
    const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            window.location.href = "/auth"
            return
        }
        fetchApps()
    }, [])

    const fetchApps = () => {
        setLoading(true)
        fetch(`/api/allowed-app`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setApps(data.data)
                }
            })
            .finally(() => setLoading(false))
    }

    function handleAppCreation() {
        if (appName == "") {
            setError("Please enter app name")
            return
        }
        setError("")

        fetch(`/api/allowed-app`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: appName,
                desc: appDesc
            })
        }).then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setApps([...apps, data.data])
                    setAppName("")
                    setAppDesc("")
                    setShowCreateModal(false)
                    if (data.token) {
                        setCreatedToken(data.token)
                        setShowTokenModal(true)
                    }
                }
            })
    }

    function handleAppDeletion(id: string) {
        setConfirmAction({
            title: "Delete App",
            message: "Are you sure you want to delete this app? This action cannot be undone.",
            danger: true,
            confirmText: "Delete",
            onConfirm: () => {
                fetch(`/api/allowed-app`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id })
                }).then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            setApps(apps.filter(app => app.id !== id))
                        }
                    })
                setConfirmAction(null)
            }
        })
    }

    function handleRegenerateToken(app: App) {
        setConfirmAction({
            title: "Regenerate Token",
            message: "This will invalidate the old token. Any services using the current token will stop working. Continue?",
            confirmText: "Regenerate",
            danger: true,
            onConfirm: () => {
                fetch(`/api/regenerate/${app.id}`, {
                    method: "PATCH",
                }).then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            if (data.token) {
                                setCreatedToken(data.token)
                                setShowTokenModal(true)
                            }
                        }
                    })
                setConfirmAction(null)
            }
        })
    }

    function openEditModal(app: App) {
        setEditingApp(app)
        setEditName(app.name)
        setEditDesc(app.description || "")
    }

    function closeEditModal() {
        setEditingApp(null)
        setEditName("")
        setEditDesc("")
    }

    function closeTokenModal() {
        setShowTokenModal(false)
        setCreatedToken(null)
        setCopied(false)
    }

    function copyTokenToClipboard() {
        if (createdToken) {
            navigator.clipboard.writeText(createdToken)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    function handleUpdateApp() {
        if (!editName || !editingApp) return;

        fetch(`/api/allowed-app`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: editingApp.id,
                name: editName,
                desc: editDesc
            })
        }).then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setApps(apps.map(app => app.id === editingApp.id ? data.data : app))
                    closeEditModal()
                }
            })
    }

    function handleLogout() {
        localStorage.removeItem("token")
        window.location.href = "/auth"
    }

    return (
        <div className='min-h-screen bg-zinc-950 text-zinc-200 font-sans'>
            {/* Header */}
            <header className='border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400'>
                            <FaServer />
                        </div>
                        <h1 className='text-lg font-semibold text-white'>Dashboard</h1>
                    </div>
                    <button
                        className='flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all'
                        onClick={handleLogout}
                    >
                        <IoMdLogOut className='text-lg' />
                        Logout
                    </button>
                </div>
            </header>

            <main className='max-w-7xl mx-auto px-6 py-8'>

                {/* Actions Bar */}
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h2 className='text-2xl font-bold text-white'>Your Apps</h2>
                        <p className='text-zinc-400 mt-1'>Manage your registered applications and API tokens</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className='flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5'
                    >
                        <MdAdd className='text-xl' />
                        New App
                    </button>
                </div>

                {/* Apps Grid */}
                {loading ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className='h-48 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse'></div>
                        ))}
                    </div>
                ) : apps.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {apps.map((app) => (
                            <div key={app.id} className='group bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all'>
                                <div className='flex justify-between items-start mb-4'>
                                    <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 border border-white/5'>
                                        <span className='font-bold text-lg'>{app.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                                        <button
                                            onClick={() => handleRegenerateToken(app)}
                                            className='p-2 text-zinc-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors'
                                            title="Regenerate Token"
                                        >
                                            <IoMdRefresh size={18} />
                                        </button>
                                        <button
                                            onClick={() => openEditModal(app)}
                                            className='p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors'
                                            title="Edit App"
                                        >
                                            <MdEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleAppDeletion(app.id)}
                                            className='p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors'
                                            title="Delete App"
                                        >
                                            <MdDelete size={18} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className='text-lg font-semibold text-white mb-2'>{app.name}</h3>
                                <p className='text-sm text-zinc-400 line-clamp-2 min-h-[2.5rem]'>
                                    {app.description || "No description provided."}
                                </p>

                                <div className='mt-6 pt-4 border-t border-zinc-800 flex items-center gap-2 text-xs text-zinc-500 font-mono'>
                                    <span className='px-2 py-1 rounded bg-zinc-800/50'>ID: {app.id.slice(-6)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20'>
                        <div className='w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500'>
                            <FaServer className='text-2xl' />
                        </div>
                        <h3 className='text-xl font-semibold text-white mb-2'>No Apps Found</h3>
                        <p className='text-zinc-400 max-w-sm mx-auto mb-6'>Get started by creating your first application to generate API tokens.</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className='px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors'
                        >
                            Create App
                        </button>
                    </div>
                )}
            </main>

            {/* Create Modal */}
            {showCreateModal && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'>
                    <div className='bg-zinc-950 border border-zinc-800 p-6 rounded-2xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200'>
                        <h2 className='text-xl font-bold text-white mb-6'>Create New App</h2>

                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-zinc-400 mb-1.5'>App Name</label>
                                <input
                                    type="text"
                                    className='w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all'
                                    placeholder="e.g. Marketing Service"
                                    value={appName}
                                    onChange={(e) => setAppName(e.target.value)}
                                />
                                {error && <p className='text-red-400 text-xs mt-1'>{error}</p>}
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-zinc-400 mb-1.5'>Description</label>
                                <textarea
                                    className='w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none h-24'
                                    placeholder="What is this app used for?"
                                    value={appDesc}
                                    onChange={(e) => setAppDesc(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className='flex justify-end gap-3 mt-8'>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className='px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAppCreation}
                                className='px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors'
                            >
                                Create App
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingApp && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'>
                    <div className='bg-zinc-950 border border-zinc-800 p-6 rounded-2xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200'>
                        <h2 className='text-xl font-bold text-white mb-6'>Edit App</h2>

                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-zinc-400 mb-1.5'>App Name</label>
                                <input
                                    type="text"
                                    className='w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all'
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-zinc-400 mb-1.5'>Description</label>
                                <textarea
                                    className='w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none h-24'
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className='flex justify-end gap-3 mt-8'>
                            <button
                                onClick={closeEditModal}
                                className='px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateApp}
                                className='px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors'
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Token Modal */}
            {showTokenModal && createdToken && (
                <div className='fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300'>
                    <div className='bg-zinc-950 border border-zinc-800 p-8 rounded-3xl w-full max-w-lg shadow-2xl scale-100 animate-in zoom-in-95 duration-300 relative overflow-hidden'>

                        {/* Background Glow */}
                        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-500/20 blur-3xl pointer-events-none'></div>

                        <div className='relative'>
                            <div className='w-16 h-16 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center mx-auto mb-6 shadow-lg'>
                                <FaKey className='text-3xl text-yellow-400' />
                            </div>

                            <h2 className='text-2xl font-bold text-white text-center mb-2'>API Token Generated</h2>
                            <p className='text-zinc-400 text-center mb-8'>
                                This token will only be shown once. Please copy it and store it securely.
                            </p>

                            <div className='bg-zinc-900/50 border border-zinc-800 rounded-xl p-1 mb-8'>
                                <div className='relative'>
                                    <code className='block w-full p-4 pr-24 bg-transparent font-mono text-sm text-zinc-300 break-all'>
                                        {createdToken}
                                    </code>
                                    <div className='absolute top-2 right-2 bottom-2'>
                                        <button
                                            onClick={copyTokenToClipboard}
                                            className={`h-full px-4 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${copied
                                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                : 'bg-white text-black hover:bg-zinc-200'
                                                }`}
                                        >
                                            {copied ? (
                                                <>
                                                    <MdCheckCircle /> Copied
                                                </>
                                            ) : (
                                                <>
                                                    <MdContentCopy /> Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-center'>
                                <button
                                    onClick={closeTokenModal}
                                    className='px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl border border-zinc-800 transition-all'
                                >
                                    I have saved this token
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmAction && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'>
                    <div className='bg-zinc-950 border border-zinc-800 p-6 rounded-2xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200'>
                        <div className='flex items-center gap-3 mb-4'>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${confirmAction.danger
                                    ? 'bg-red-500/10 text-red-400'
                                    : 'bg-yellow-500/10 text-yellow-400'
                                }`}>
                                <MdWarning className='text-xl' />
                            </div>
                            <h2 className='text-xl font-bold text-white'>{confirmAction.title}</h2>
                        </div>

                        <p className='text-zinc-400 mb-8 leading-relaxed'>
                            {confirmAction.message}
                        </p>

                        <div className='flex justify-end gap-3'>
                            <button
                                onClick={() => setConfirmAction(null)}
                                className='px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAction.onConfirm}
                                className={`px-6 py-2 font-medium rounded-lg transition-colors ${confirmAction.danger
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-white text-black hover:bg-zinc-200'
                                    }`}
                            >
                                {confirmAction.confirmText || 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Page
