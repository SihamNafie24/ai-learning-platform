import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { FileText, BookOpen, TrendingUp, Clock, Plus, Eye, Edit, Sparkles, BarChart3, Zap } from 'lucide-react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { api } from '../lib/api';

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

function DashboardPage() {
  const [contents, setContents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    lessons: 0,
    quizzes: 0,
    thisWeek: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setError(null);
        const data = await api.getUserContent();
        setContents(data || []);

        // Calculate stats with safe date parsing
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        setStats({
          total: data?.length || 0,
          lessons: data?.filter((c: any) => c.content_type === 'lesson').length || 0,
          quizzes: data?.filter((c: any) => c.content_type === 'quiz').length || 0,
          thisWeek: data?.filter((c: any) => {
            try {
              const createdDate = new Date(c.created_at);
              return !isNaN(createdDate.getTime()) && createdDate > weekAgo;
            } catch {
              return false;
            }
          }).length || 0,
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
        setContents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const recentContents = contents.slice(0, 3);

  // Helper function to safely format dates
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) ? date.toLocaleDateString() : 'N/A';
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-600">Here's what's happening with your content today</p>
          </div>
          <Link
            to="/create-content"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm">
              <span className="font-semibold">Error:</span> {error}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Content */}
          <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : stats.total}</p>
                  <p className="text-sm text-gray-500 mt-1">Total Content</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-green-600 font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                All time
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-1">
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : stats.lessons}</p>
                  <p className="text-sm text-gray-500 mt-1">Lessons</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <Sparkles className="w-3 h-3 mr-1" />
                Educational
              </div>
            </div>
          </div>

          {/* Quizzes */}
          <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : stats.quizzes}</p>
                  <p className="text-sm text-gray-500 mt-1">Quizzes</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <Zap className="w-3 h-3 mr-1" />
                Interactive
              </div>
            </div>
          </div>

          {/* This Week */}
          <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : stats.thisWeek}</p>
                  <p className="text-sm text-gray-500 mt-1">This Week</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-orange-600 font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                Last 7 days
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Content */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Content</h2>
                <Link
                  to="/my-contents"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  View all →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : recentContents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No content yet</p>
                  <Link
                    to="/create-content"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first content
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentContents.map((content) => (
                    <div
                      key={content.id}
                      className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`p-2 rounded-lg ${content.content_type === 'quiz' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                          {content.content_type === 'quiz' ? (
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{content.title || 'Untitled'}</h3>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <span className="uppercase font-medium">{content.content_type || 'N/A'}</span>
                            <span>•</span>
                            <span>{content.subject || 'N/A'}</span>
                            <span>•</span>
                            <span>{formatDate(content.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/content/${content.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/content/${content.id}/edit`}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to="/create-content"
                className="flex items-center p-4 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Create Content</p>
                  <p className="text-xs text-gray-500">Upload and generate</p>
                </div>
              </Link>

              <Link
                to="/my-contents"
                className="flex items-center p-4 rounded-xl border-2 border-dashed border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
              >
                <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">My Contents</p>
                  <p className="text-xs text-gray-500">View all content</p>
                </div>
              </Link>

              {/* Motivational Card */}
              <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <div className="flex items-center mb-3">
                  <Sparkles className="w-5 h-5 mr-2" />
                  <p className="font-semibold">Keep it up!</p>
                </div>
                <p className="text-sm text-blue-100">
                  You've created {stats.total} piece{stats.total !== 1 ? 's' : ''} of content. Keep creating amazing educational materials!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}