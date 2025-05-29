import { useState, useCallback, useEffect } from 'react';
import { FileSystemEntry, fileSystemService } from '@/services/FileSystemService';

export function useFileSystem() {
  const [currentPath, setCurrentPath] = useState<string>(fileSystemService.getBaseDirectory());
  const [entries, setEntries] = useState<FileSystemEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const contents = await fileSystemService.getDirectoryContents(path);
      setEntries(contents);
      setCurrentPath(path);
    } catch (e) {
      setError(e as Error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const goUp = useCallback(() => {
    const parent = fileSystemService.getParentDirectory(currentPath);
    if (parent) load(parent);
  }, [currentPath, load]);

  const refresh = useCallback(() => {
    load(currentPath);
  }, [currentPath, load]);

  useEffect(() => { load(currentPath); }, [load, currentPath]);

  return {
    currentPath,
    entries,
    loading,
    error,
    basePath: fileSystemService.getBaseDirectory(),
    canGoUp: currentPath !== fileSystemService.getBaseDirectory(),
    load,
    goUp,
    refresh,
  } as const;
}