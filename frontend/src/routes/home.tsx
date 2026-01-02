import { createFileRoute, Link } from '@tanstack/react-router';
import { Sparkles, Zap, Shield, Rocket, ArrowRight, BookOpen, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Route = createFileRoute('/home')({
    component: Home,
});

function Home() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
                    {/* Animated background circles */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg mb-8 border border-purple-100">
                            <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
                            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                AI-Powered Content Creation
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                            <span className="block text-gray-900">Transform PDFs into</span>
                            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Interactive Learning
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
                            Create engaging educational content, quizzes, and lessons from your PDFs in seconds with the power of AI.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white rounded-xl shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-purple-300 transition-all duration-200"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/signup"
                                        className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                                    >
                                        Get Started Free
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white rounded-xl shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-purple-300 transition-all duration-200"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">10K+</div>
                                <div className="text-sm text-gray-600 mt-1">Content Created</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">5K+</div>
                                <div className="text-sm text-gray-600 mt-1">Active Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">99%</div>
                                <div className="text-sm text-gray-600 mt-1">Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase mb-2">Features</h2>
                        <p className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                            Everything you need to create
                        </p>
                        <p className="mt-4 text-xl text-gray-600">
                            Powerful tools designed for educators and content creators
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={feature.name}
                                className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-2"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full"></div>
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-200`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.name}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Create amazing content in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={step.title} className="relative">
                                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold mb-6 mx-auto">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{step.title}</h3>
                                    <p className="text-gray-600 text-center leading-relaxed">{step.description}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                                        <ArrowRight className="w-8 h-8 text-purple-300" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                                Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Novi</span>?
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Join thousands of educators and content creators who trust Novi to transform their teaching materials.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit) => (
                                    <div key={benefit} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                                                <Check className="w-4 h-4 text-green-600" />
                                            </div>
                                        </div>
                                        <p className="ml-3 text-lg text-gray-700">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <Rocket className="w-32 h-32 text-purple-600 mx-auto mb-4" />
                                        <p className="text-2xl font-bold text-gray-900">Start Creating Today</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-6">
                        Ready to Transform Your Content?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10">
                        Join Novi today and start creating engaging educational content in minutes.
                    </p>
                    {isAuthenticated ? (
                        <button
                            onClick={logout}
                            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-purple-600 bg-white rounded-xl shadow-2xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
                        >
                            Logout Now
                            <Sparkles className="ml-2 w-5 h-5" />
                        </button>
                    ) : (
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-purple-600 bg-white rounded-xl shadow-2xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
                        >
                            Get Started Free
                            <Sparkles className="ml-2 w-5 h-5" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

const features = [
    {
        name: 'AI-Powered',
        description: 'Advanced AI technology transforms your PDFs into interactive content automatically.',
        icon: Sparkles,
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        name: 'Lightning Fast',
        description: 'Generate complete lessons and quizzes in seconds, not hours.',
        icon: Zap,
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        name: 'Secure & Private',
        description: 'Your content is encrypted and stored securely with enterprise-grade protection.',
        icon: Shield,
        gradient: 'from-green-500 to-emerald-500',
    },
    {
        name: 'Easy to Use',
        description: 'Intuitive interface designed for educators, no technical skills required.',
        icon: BookOpen,
        gradient: 'from-orange-500 to-red-500',
    },
];

const steps = [
    {
        title: 'Upload PDF',
        description: 'Simply upload your PDF document or educational material to get started.',
    },
    {
        title: 'AI Processing',
        description: 'Our AI analyzes and transforms your content into interactive lessons and quizzes.',
    },
    {
        title: 'Download & Share',
        description: 'Get your beautifully formatted content ready to use and share with students.',
    },
];

const benefits = [
    'Save hours of content creation time',
    'Create engaging, interactive materials',
    'Customize content to your needs',
    'Access your content anywhere, anytime',
    'Collaborate with other educators',
    'Track student engagement and progress',
];
