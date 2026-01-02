import React from 'react';
import { Code, Terminal, BookOpen, Zap, GitBranch, Cpu, Shield, BarChart2 } from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: <Code className="w-8 h-8 text-blue-600" />,
      title: 'Interactive Coding',
      description: 'Write and test code directly in your browser with our built-in editor and live preview.'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: 'Structured Learning Paths',
      description: 'Follow guided learning paths tailored to your skill level and goals.'
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: 'Quick Challenges',
      description: 'Test your knowledge with bite-sized coding challenges and exercises.'
    },
    {
      icon: <GitBranch className="w-8 h-8 text-blue-600" />,
      title: 'Version Control',
      description: 'Learn Git and GitHub workflows with hands-on practice.'
    },
    {
      icon: <Cpu className="w-8 h-8 text-blue-600" />,
      title: 'Real Projects',
      description: 'Build real-world applications and add them to your portfolio.'
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: 'Secure Environment',
      description: 'Practice coding in a safe, sandboxed environment.'
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block">Build Better,</span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Code Smarter
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Master modern web development with our interactive platform. Learn by building real projects and solving real problems.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Learning for Free
            </a>
            <a
              href="#features"
              className="px-8 py-4 bg-white text-gray-700 border border-gray-200 text-lg font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Explore Features
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed to help you learn and grow as a developer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-200 hover:border-blue-100 border border-transparent"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
              Ready to start your coding journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of developers who are already building amazing projects with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="px-8 py-4 bg-white text-blue-700 text-lg font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Get Started for Free
              </a>
              <a
                href="/about"
                className="px-8 py-4 text-white text-lg font-medium border-2 border-white rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}