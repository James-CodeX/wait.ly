import { useState, useRef } from 'react';
import { GripVertical } from 'lucide-react';

interface EmailEditorProps {
  subject: string;
  body: string;
  onSubjectChange: (subject: string) => void;
  onBodyChange: (body: string) => void;
  disabled?: boolean;
}

interface Variable {
  label: string;
  value: string;
  description: string;
}

const VARIABLES: Variable[] = [
  { label: 'Name', value: '{{name}}', description: "Recipient's name" },
  { label: 'Position', value: '{{position}}', description: 'Waitlist position number' },
  { label: 'Waitlist Name', value: '{{waitlist_name}}', description: 'Project/waitlist name' },
];

export default function EmailEditor({ subject, body, onSubjectChange, onBodyChange, disabled }: EmailEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draggedVariable, setDraggedVariable] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, variable: string) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', variable);
    setDraggedVariable(variable);
  };

  const handleDragEnd = () => {
    setDraggedVariable(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;

    const variable = e.dataTransfer.getData('text/plain');
    const textarea = textareaRef.current;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const newText = text.substring(0, start) + variable + text.substring(end);
    onBodyChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + variable.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleVariableClick = (variable: string) => {
    if (disabled) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const newText = text.substring(0, start) + variable + text.substring(end);
    onBodyChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + variable.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-mint-900 dark:text-dark-text mb-2">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 bg-mint-50 dark:bg-dark-card border-2 border-mint-600/20 dark:border-dark-border rounded-xl text-mint-900 dark:text-dark-text focus:outline-none focus:border-mint-600 dark:focus:border-mint-500 disabled:opacity-50"
          placeholder="Email subject line"
        />
      </div>

      <div className="grid lg:grid-cols-[1fr,340px] gap-6">
        <div>
          <label className="block text-sm font-medium text-mint-900 dark:text-dark-text mb-2">
            Message
          </label>
          <textarea
            ref={textareaRef}
            rows={20}
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            disabled={disabled}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full px-4 py-3 bg-mint-50 dark:bg-dark-card border-2 border-mint-600/20 dark:border-dark-border rounded-xl text-mint-900 dark:text-dark-text focus:outline-none focus:border-mint-600 dark:focus:border-mint-500 resize-none disabled:opacity-50 font-mono text-sm"
            placeholder="Write your email message here. Drag and drop variables from the right panel..."
          />
        </div>

        <div className="space-y-6">
          <div className="bg-mint-50 dark:bg-dark-hover border border-mint-600/20 dark:border-dark-border rounded-xl p-5">
            <h4 className="text-base font-semibold text-mint-900 dark:text-dark-text mb-2">
              Preview Example
            </h4>
            <div className="bg-white dark:bg-dark-card p-4 rounded-lg border border-mint-600/10 dark:border-dark-border">
              <p className="text-sm text-mint-900 dark:text-dark-text mb-2">
                <strong>Subject:</strong> {subject || 'Your subject line will appear here'}
              </p>
              <hr className="border-mint-600/10 dark:border-dark-border my-3" />
              <div className="text-sm text-mint-900 dark:text-dark-text whitespace-pre-wrap max-h-64 overflow-y-auto">
                {body
                  ? body
                      .replace(/\{\{name\}\}/g, 'John Doe')
                      .replace(/\{\{position\}\}/g, '42')
                      .replace(/\{\{waitlist_name\}\}/g, 'Awesome Product')
                  : 'Your message will appear here with variables replaced...'}
              </div>
            </div>
          </div>

          <div className="bg-mint-50 dark:bg-dark-hover border-2 border-mint-600/20 dark:border-dark-border rounded-xl p-5">
            <h4 className="text-base font-semibold text-mint-900 dark:text-dark-text mb-3">
              Available Variables
            </h4>
            <p className="text-xs text-mint-900/70 dark:text-dark-text-muted mb-4">
              Drag variables into the message or click to insert at cursor
            </p>

            <div className="space-y-2">
              {VARIABLES.map((variable) => (
                <div
                  key={variable.value}
                  draggable={!disabled}
                  onDragStart={(e) => handleDragStart(e, variable.value)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleVariableClick(variable.value)}
                  className={`group flex items-start gap-2 p-3 bg-white dark:bg-dark-card border-2 border-mint-600/20 dark:border-dark-border rounded-lg transition-all ${
                    disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-grab active:cursor-grabbing hover:border-mint-600 dark:hover:border-mint-500 hover:shadow-md'
                  } ${
                    draggedVariable === variable.value
                      ? 'opacity-50 scale-95'
                      : ''
                  }`}
                >
                  {!disabled && (
                    <GripVertical className="w-4 h-4 text-mint-900/40 dark:text-dark-text-muted flex-shrink-0 mt-0.5 group-hover:text-mint-600 dark:group-hover:text-mint-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-mint-900 dark:text-dark-text text-sm">
                        {variable.label}
                      </p>
                    </div>
                    <code className="text-xs text-mint-600 dark:text-mint-400 font-mono bg-mint-100 dark:bg-dark-bg px-2 py-0.5 rounded">
                      {variable.value}
                    </code>
                    <p className="text-xs text-mint-900/70 dark:text-dark-text-muted mt-1">
                      {variable.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
                <strong>Tip:</strong> These variables will be automatically replaced with actual values when emails are sent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
