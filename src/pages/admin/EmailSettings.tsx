import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EmailTemplate {
  template_type: string;
  subject: string;
  body_content: string;
}

export function EmailSettings() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('admin_session='))?.split('=')[1];
      const res = await fetch(`/api/admin/emails?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTemplates(data.templates);
        if (data.templates.length > 0) {
          selectTab(data.templates[0]);
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch templates' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectTab = (template: EmailTemplate) => {
    setActiveTab(template.template_type);
    setSubject(template.subject);
    setBodyContent(template.body_content);
    setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('admin_session='))?.split('=')[1];
      const res = await fetch('/api/admin/emails', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          template_type: activeTab,
          subject,
          body_content: bodyContent
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Template updated successfully' });
        // Update local state
        setTemplates(templates.map(t => 
          t.template_type === activeTab ? { ...t, subject, body_content: bodyContent } : t
        ));
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update template' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mt-20"></div>;
  }

  const getTabLabel = (type: string) => {
    switch (type) {
      case 'preorder_confirmation': return 'Preorder Confirmation';
      case 'copy_ready': return 'Copy is Ready';
      case 'release_notification': return 'Official Release';
      default: return type;
    }
  };

  const getAvailableVariables = (type: string) => {
    switch (type) {
      case 'preorder_confirmation': 
        return '{{name}}, {{bookTitle}}, {{quantity}}, {{amount}}, {{reference}}, {{releaseDate}}';
      case 'copy_ready': 
        return '{{name}}, {{bookTitle}}, {{reference}}';
      case 'release_notification': 
        return '{{name}}, {{bookTitle}}';
      default: 
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Email Templates</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {templates.map((template) => (
              <button
                key={template.template_type}
                onClick={() => selectTab(template)}
                className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === template.template_type
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {getTabLabel(template.template_type)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <form onSubmit={handleSave}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Variables
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 font-mono">
                {getAvailableVariables(activeTab)}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                You can insert these variables exactly as shown into the Subject or Body. They will be automatically replaced when the email is sent.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Body (Text)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Line breaks will automatically be converted to paragraphs. The email will be wrapped in the premium editorial styling.
                </p>
                <textarea
                  id="body"
                  value={bodyContent}
                  onChange={(e) => setBodyContent(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900 font-sans"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Template'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
