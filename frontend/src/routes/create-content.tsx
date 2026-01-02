import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { api } from '../lib/api';
import { useForm } from 'react-hook-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Upload, BookOpen, GraduationCap, FileText, X, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '../components/ProtectedRoute';

type ContentType = 'quiz' | 'lesson';

const subjects = [
  'Mathématiques',
  'Physique et Chimie',
  'Sciences de la Vie et de la Terre',
  'Philosophie',
  'Français',
  'Arabe',
  'Anglais',
  'Histoire et Géographie',
  'Education Islamique',
];



const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

// This is a workaround for the route registration issue
// The actual route should be registered in your route configuration
const CreateContentRoute = () => {
  return (
    <ProtectedRoute>
      <CreateContentPage />
    </ProtectedRoute>
  );
};

export const Route = createFileRoute('/create-content')({
  component: CreateContentRoute,
});

export default function CreateContentPage() {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    subject: string;
    grade: string;
    contentType: ContentType;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<{
    subject: string;
    grade: string;
    contentType: ContentType;
  }>({
    defaultValues: {
      subject: '',
      grade: '',
      contentType: 'lesson',
    },
  });

  const contentType = watch('contentType');

  const onSubmit = async (data: { subject: string; grade: string; contentType: ContentType }) => {
    if (!file) {
      setError('Please upload a PDF file');
      return;
    }

    if (!data.subject || !data.grade) {
      setError('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await api.uploadPDF(file, data.subject, data.grade, data.contentType);
      console.log("result:", result);
      setPreviewContent(result.htmlContent);
      setFormData(data); // Save form data for later use when saving
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a valid PDF file');
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteContent = async () => {
    setPreviewContent(null);
    setFile(null);
    setFormData(null);
  };

  const handleSaveContent = async () => {
    if (!previewContent || !formData || !file) {
      setError('No content to save');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await api.saveContent({
        title: file.name.replace('.pdf', ''),
        subject: formData.subject,
        grade: formData.grade,
        contentType: formData.contentType,
        html: previewContent,
        metadata: {
          originalFileName: file.name,
          generatedAt: new Date().toISOString(),
        },
      });

      console.log('✅ Content saved successfully');
      // Navigate to my-contents page
      navigate({ to: '/my-contents' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Content</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Content Details</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* File Upload */}
            <div>
              <label htmlFor="pdf-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${file ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  id="pdf-upload"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                  aria-describedby="file-upload-description"
                />
                {file ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove file"
                      title="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-10 w-10 mx-auto text-gray-400" />
                    <p id="file-upload-description" className="mt-2 text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF (max. 10MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Subject Selection */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                {...register('subject', { required: 'Subject is required' })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>

            {/* Grade Selection */}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Grade <span className="text-red-500">*</span>
              </label>
              <select
                id="grade"
                {...register('grade', { required: 'Grade is required' })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a grade</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              {errors.grade && (
                <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
              )}
            </div>

            {/* Content Type Selection */}
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Content Type <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="radio"
                    id="content-type-lesson"
                    className="sr-only"
                    value="lesson"
                    checked={contentType === 'lesson'}
                    onChange={() => setValue('contentType', 'lesson')}
                  />
                  <label
                    htmlFor="content-type-lesson"
                    className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${contentType === 'lesson' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className="text-center">
                      <BookOpen className="h-6 w-6 mx-auto mb-2 text-blue-600" aria-hidden="true" />
                      <span className="text-sm font-medium">
                        <span className="sr-only">Content Type: </span>
                        Lesson
                      </span>
                    </div>
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="content-type-quiz"
                    className="sr-only"
                    value="quiz"
                    checked={contentType === 'quiz'}
                    onChange={() => setValue('contentType', 'quiz')}
                  />
                  <label
                    htmlFor="content-type-quiz"
                    className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${contentType === 'quiz' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className="text-center">
                      <GraduationCap className="h-6 w-6 mx-auto mb-2 text-purple-600" aria-hidden="true" />
                      <span className="text-sm font-medium">
                        <span className="sr-only">Content Type: </span>
                        Quiz
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isUploading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isUploading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Creating...
                  </>
                ) : (
                  'Create Content'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Preview</h2>

          {previewContent ? (
            <div className="space-y-4">
              <iframe
                title="Preview"
                className="w-full h-[500px] border rounded-lg"
                srcDoc={previewContent}
              />
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleDeleteContent}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleSaveContent}
                  disabled={isSaving}
                  className={`px-6 py-2 rounded-md font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all ${isSaving
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg'
                    }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="inline-block animate-spin -ml-1 mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="inline-block -ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save to My Contents
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No content generated yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload a PDF and fill out the form to generate content preview.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
