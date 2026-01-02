import { createFileRoute, useParams, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { ArrowLeft, Calendar, FileText, BookOpen, Edit, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/content/$contentId')({
    component: () => (
        <ProtectedRoute>
            <ViewContentPage />
        </ProtectedRoute>
    ),
});

function ViewContentPage() {
    const { contentId } = Route.useParams();
    const [content, setContent] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadContent = async () => {
            try {
                setIsLoading(true);
                const data = await api.getContent(contentId);
                setContent(data);
            } catch (err) {
                console.error('Failed to load content:', err);
                setError('Failed to load content. It may have been deleted or you do not have permission to view it.');
            } finally {
                setIsLoading(false);
            }
        };

        if (contentId) {
            loadContent();
        }
    }, [contentId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !content) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Content</h2>
                    <p className="text-gray-600 mb-6">{error || 'Content not found'}</p>
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
                            to="/my-contents"
                            className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${content.content_type === 'quiz' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                {content.content_type === 'quiz' ? <FileText className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 truncate max-w-md">{content.title}</h1>
                                <div className="flex items-center text-xs text-gray-500 space-x-3">
                                    <span className="uppercase font-medium tracking-wide">{content.content_type}</span>
                                    <span>•</span>
                                    <span>{content.subject}</span>
                                    <span>•</span>
                                    <span>{content.grade}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link
                            to={`/content/${contentId}/edit`}
                            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Edit className="w-4 h-4 mr-1.5" />
                            Edit
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
                    {/* Content Body - Rendered in iframe for isolation */}
                    <div className="flex-1 bg-white p-1">
                        <iframe
                            srcDoc={content.body}
                            title="Content Preview"
                            className="w-full h-full min-h-[600px] border-0"
                            sandbox="allow-same-origin allow-scripts"
                        />
                    </div>
                </div>

                {/* Metadata / Footer */}
                <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        Created on {new Date(content.created_at).toLocaleDateString()}
                    </div>
                    {/* Add more metadata here if needed */}
                </div>
            </main>
        </div>
    );
}
