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

    const getThemeExtension = () => {
      const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      return isDark ? oneDark : [];
    };

    const view = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        markdown({ base: markdown().language, codeLanguages: languages }),
        themeCompartment.of(getThemeExtension()),
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
      const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      viewRef.current.dispatch({
        effects: themeCompartment.reconfigure(isDark ? oneDark : []),
      });
    }
  }, [theme]);

  // Update doc if value changes externally (e.g. initial load)
  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={editorRef} className="h-full overflow-auto font-mono text-sm" />;
});

export default MarkdownEditor;
