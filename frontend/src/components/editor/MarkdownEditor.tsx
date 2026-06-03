import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { oneDark } from '@codemirror/theme-one-dark';
import { useUIStore } from '../../store/ui.store';
import { Compartment } from '@codemirror/state';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export interface MarkdownEditorHandle {
  insertText: (text: string) => void;
}

const themeCompartment = new Compartment();

const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(({ value, onChange }, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const theme = useUIStore((state) => state.theme);

  const getThemeExtension = (currentTheme: string) => {
    const isDark = currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    const customStyles = EditorView.theme({
      '&': {
        backgroundColor: 'transparent !important',
        height: '100%',
      },
      '.cm-content': {
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '14px',
        lineHeight: '1.8',
        padding: '20px 0',
      },
      '.cm-gutters': {
        backgroundColor: 'transparent !important',
        border: 'none !important',
        color: isDark ? '#484f58' : '#9ca3af',
        userSelect: 'none',
      },
      '.cm-activeLine': {
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03) !important' : 'rgba(0, 0, 0, 0.03) !important',
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'transparent !important',
        color: isDark ? '#e6edf3' : '#111827',
      },
      '.cm-selectionBackground, ::selection': {
        backgroundColor: 'rgba(16, 185, 129, 0.2) !important',
      },
      '.cm-cursor': {
        borderLeftColor: '#10b981 !important',
        borderLeftWidth: '2px',
      },
    }, { dark: isDark });

    return isDark ? [oneDark, customStyles] : [customStyles];
  };

  useImperativeHandle(ref, () => ({
    insertText: (text: string) => {
      if (viewRef.current) {
        const { from, to } = viewRef.current.state.selection.main;
        viewRef.current.dispatch({
          changes: { from, to, insert: text },
          selection: { anchor: from + text.length },
        });
      }
    },
  }));

  useEffect(() => {
    if (!editorRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    });

    const view = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        markdown({ base: markdown().language, codeLanguages: languages }),
        themeCompartment.of(getThemeExtension(theme)),
        EditorView.lineWrapping,
        updateListener,
      ],
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  // Update theme dynamically
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: themeCompartment.reconfigure(getThemeExtension(theme)),
      });
    }
  }, [theme]);

  // Update doc if value changes externally
  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={editorRef} className="h-full overflow-auto" />;
});

export default MarkdownEditor;
