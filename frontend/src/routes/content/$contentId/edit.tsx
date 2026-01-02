import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export const Route = createFileRoute('/content/$contentId/edit')({
    component: () => (
        <ProtectedRoute>
            <EditContentPage />
        </ProtectedRoute>
    ),
});

function EditContentPage() {
    const { contentId } = Route.useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        grade: '',
        content_type: 'lesson',
        body: '',
    });

    useEffect(() => {
        const loadContent = async () => {
            try {
                setIsLoading(true);
                const data = await api.getContent(contentId);
                setFormData({
                    title: data.title,
                    subject: data.subject,
                    grade: data.grade,
                    content_type: data.content_type,
                    body: data.body || '',
                });
            } catch (err) {
                console.error('Failed to load content:', err);
                setError('Failed to load content.');
            } finally {
                setIsLoading(false);
            }
        };

        if (contentId) {
            loadContent();
        }
    }, [contentId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            await api.updateContent(contentId, formData);
            navigate({ to: `/content/${contentId}` });
        } catch (err) {
            console.error('Failed to update content:', err);
            alert('Failed to update content');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link
                        to="/my-contents"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to My Contents
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            to={`/content/${contentId}`}
                            className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Edit Content</h1>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="col-span-2">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                                />
                            </div>

                            {/* Grade */}
                            <div>
                                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                                    Grade
                                </label>
                                <input
                                    type="text"
                                    id="grade"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                                />
                            </div>

                            {/* Content Type */}
                            <div>
                                <label htmlFor="content_type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <select
                                    id="content_type"
                                    name="content_type"
                                    value={formData.content_type}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                                >
                                    <option value="lesson">Lesson</option>
                                    <option value="quiz">Quiz</option>
                                </select>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div>
                            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                                Content (HTML)
                            </label>
                            <textarea
                                id="body"
                                name="body"
                                rows={15}
                                value={formData.body}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border font-mono text-xs"
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                You can edit the raw HTML content here. Be careful not to break the structure.
                            </p>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
