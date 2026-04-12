'use client';

import { useEffect, useCallback } from 'react';
import { Toolbar } from './Toolbar';
import { Grid } from './Grid';
import { StatusBar } from './StatusBar';
import { MobileToolbar } from './MobileToolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { useKeyboard } from '@/hooks/use-keyboard';
import { useEditorStore } from '@/hooks/use-editor-store';
import { useSaveWireframe } from '@/hooks/useSaveWireframe';
import { useLoadWireframe } from '@/hooks/useLoadWireframe';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface EditorProps {
  wireframeId?: string | null;
}

export function Editor({ wireframeId }: EditorProps) {
  useKeyboard();
  const theme = useEditorStore((s) => s.theme);
  const toggleTheme = useEditorStore((s) => s.toggleTheme);
  const { save, saving, setCurrentId, setTitle } = useSaveWireframe();

  const onLoaded = useCallback(
    (data: { id: string; title: string }) => {
      setCurrentId(data.id);
      setTitle(data.title);
    },
    [setCurrentId, setTitle],
  );

  useLoadWireframe(wireframeId ?? null, onLoaded);

  const handleSave = useCallback(async () => {
    try {
      await save();
      toast.success('Saved!');
    } catch {
      toast.error('Failed to save');
    }
  }, [save]);

  // Hydrate theme from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ascii-editor-theme');
      if (saved === 'dark') toggleTheme();
    } catch {}
  }, [toggleTheme]);

  // Sync .dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        {/* Desktop sidebar — hidden on mobile */}
        <div className="hidden md:block h-full">
          <Toolbar onSave={handleSave} saving={saving} />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <Grid />
          <StatusBar />
          {/* Spacer so grid content isn't hidden behind mobile bottom bar */}
          <div
            className="md:hidden shrink-0"
            style={{ height: 'calc(88px + env(safe-area-inset-bottom, 0px))' }}
          />
        </div>

        {/* Desktop inspector panel */}
        <div className="hidden md:block h-full">
          <PropertiesPanel />
        </div>

        {/* Mobile bottom toolbar + sheet */}
        <MobileToolbar onSave={handleSave} saving={saving} />
      </div>
      <Toaster position="bottom-right" />
    </TooltipProvider>
  );
}
