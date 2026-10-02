import { useState, useRef, type ChangeEvent } from 'react';

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

type ToolbarAction = {
  label: string;
  icon: string;
  action: (selectedText: string) => { prefix: string; suffix: string; placeholder?: string };
};

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    label: 'Bold',
    icon: 'B',
    action: (sel) => ({ prefix: '**', suffix: '**', placeholder: sel || 'bold text' }),
  },
  {
    label: 'Italic',
    icon: 'I',
    action: (sel) => ({ prefix: '_', suffix: '_', placeholder: sel || 'italic text' }),
  },
  {
    label: 'Heading 2',
    icon: 'H2',
    action: (sel) => ({ prefix: '## ', suffix: '', placeholder: sel || 'Heading' }),
  },
  {
    label: 'Heading 3',
    icon: 'H3',
    action: (sel) => ({ prefix: '### ', suffix: '', placeholder: sel || 'Heading' }),
  },
  {
    label: 'Link',
    icon: '🔗',
    action: (sel) => ({ prefix: '[', suffix: '](url)', placeholder: sel || 'link text' }),
  },
  {
    label: 'Code',
    icon: '</>',
    action: (sel) => ({ prefix: '`', suffix: '`', placeholder: sel || 'code' }),
  },
  {
    label: 'Code Block',
    icon: '```',
    action: (sel) => ({ prefix: '```\n', suffix: '\n```', placeholder: sel || 'code block' }),
  },
  {
    label: 'Quote',
    icon: '❝',
    action: (sel) => ({ prefix: '> ', suffix: '', placeholder: sel || 'blockquote' }),
  },
  {
    label: 'Bullet List',
    icon: '• —',
    action: (sel) => ({ prefix: '- ', suffix: '', placeholder: sel || 'list item' }),
  },
  {
    label: 'Numbered List',
    icon: '1.',
    action: (sel) => ({ prefix: '1. ', suffix: '', placeholder: sel || 'list item' }),
  },
];

export function BlogEditor({ value, onChange, error }: BlogEditorProps) {
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applyFormat(action: ToolbarAction) {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const { prefix, suffix, placeholder } = action.action(selected);
    const insert = prefix + (selected || placeholder || '') + suffix;

    const newValue = value.substring(0, start) + insert + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      ta.focus();
      const newCursorPos = start + insert.length;
      ta.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#1C1917] font-sans">
          Content <span className="text-[#C41E3A]">*</span>
        </label>
        <div className="flex rounded-md border border-[#E7E5E4] overflow-hidden text-xs font-sans">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`px-3 py-1.5 transition-colors ${!preview ? 'bg-[#1C1917] text-white' : 'bg-white text-[#78716C] hover:bg-[#F5F5F4]'}`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`px-3 py-1.5 transition-colors ${preview ? 'bg-[#1C1917] text-white' : 'bg-white text-[#78716C] hover:bg-[#F5F5F4]'}`}
          >
            Preview
          </button>
        </div>
      </div>

      {!preview ? (
        <div className={`border rounded-lg overflow-hidden ${error ? 'border-[#C41E3A]' : 'border-[#E7E5E4]'}`}>
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 bg-[#FAFAF9] border-b border-[#E7E5E4]">
            {TOOLBAR_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                title={action.label}
                onClick={() => applyFormat(action)}
                className="px-2 py-1 text-xs font-mono text-[#57534E] hover:bg-[#E7E5E4] rounded transition-colors"
              >
                {action.icon}
              </button>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            placeholder="Write your blog post here... Markdown is supported."
            rows={18}
            className="w-full px-4 py-3 text-sm font-mono text-[#1C1917] bg-white resize-none focus:outline-none leading-relaxed placeholder:text-[#A8A29E]"
          />
          <div className="px-4 py-2 bg-[#FAFAF9] border-t border-[#E7E5E4]">
            <p className="text-xs text-[#A8A29E] font-sans">
              Markdown supported · {value.trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
        </div>
      ) : (
        <div className={`border rounded-lg overflow-hidden ${error ? 'border-[#C41E3A]' : 'border-[#E7E5E4]'} min-h-80`}>
          <div className="px-4 py-2 bg-[#FAFAF9] border-b border-[#E7E5E4]">
            <p className="text-xs text-[#A8A29E] font-sans">Preview — this is how readers will see your content</p>
          </div>
          <div className="p-6">
            {value.trim() ? (
              <div className="prose">
                <MarkdownPreview content={value} />
              </div>
            ) : (
              <p className="text-[#A8A29E] font-sans text-sm italic">Nothing to preview yet — start writing!</p>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-[#C41E3A] font-sans">{error}</p>}
    </div>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  const html = content
    .replace(/^### (.+)/gm, '<h3>$1</h3>')
    .replace(/^## (.+)/gm, '<h2>$1</h2>')
    .replace(/^# (.+)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```[\w]*\n([\s\S]+?)\n```/g, '<pre><code>$1</code></pre>')
    .replace(/^> (.+)/gm, '<blockquote>$1</blockquote>')
    .replace(/^\- (.+)/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)/gm, '<li>$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hblpac])(.+)/gm, '$1');

  return <div dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }} />;
}
