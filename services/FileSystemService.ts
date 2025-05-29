import * as FileSystem from 'expo-file-system';

export interface FileSystemEntry {
  name: string;
  uri: string;
  isDirectory: boolean;
  size?: number;
  modificationTime?: number;
}

class FileSystemService {
  private readonly baseDir: string;

  constructor() {
    this.baseDir = ensureSlash(FileSystem.documentDirectory || '') + 'AppData/';
    this.init();
  }

  getBaseDirectory(): string {
    return this.baseDir;
  }

  private async init(): Promise<void> {
    try {
      await this.ensureDir(this.baseDir);
      await this.ensureDir(this.baseDir + 'Documents/');
      const sampleFile = this.baseDir + 'file.txt';
      await FileSystem.writeAsStringAsync(sampleFile, 'Text content');
    } catch (e) {
      console.error('Failed to init FileSystemService:', e);
    }
  }

  private async ensureDir(path: string): Promise<void> {
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(path, { intermediates: true });
    }
  }

  private normalizePath(p: string): string {
    return ensureSlash(p);
  }

  async getDirectoryContents(path: string): Promise<FileSystemEntry[]> {
    const dir = this.normalizePath(path);
    try {
      const items = await FileSystem.readDirectoryAsync(dir);
      return await Promise.all(
        items.map(async name => ({
          name,
          uri: dir + name,
          isDirectory: (await FileSystem.getInfoAsync(dir + name)).isDirectory,
          size: (await FileSystem.getInfoAsync(dir + name, { size: true })).size || 0,
          modificationTime: (await FileSystem.getInfoAsync(dir + name, { size: true })).modificationTime || 0,
        }))
      );
    } catch {
      return [];
    }
  }

  getParentDirectory(path: string): string | null {
    const dir = normalizeNoSlash(path);
    if (!dir.startsWith(normalizeNoSlash(this.baseDir))) return null;
    const idx = dir.lastIndexOf('/');
    return idx > -1 ? ensureSlash(dir.substring(0, idx)) : this.baseDir;
  }

  async createFolder(parent: string, name: string): Promise<string> {
    const target = this.normalizePath(parent) + name + '/';
    const info = await FileSystem.getInfoAsync(target);
    if (info.exists) throw new Error('Folder already exists');
    await FileSystem.makeDirectoryAsync(target);
    return target;
  }

  async createTextFile(parent: string, name: string, content: string): Promise<string> {
    const fileName = name.endsWith('.txt') ? name : name + '.txt';
    const path = this.normalizePath(parent) + fileName;
    if ((await FileSystem.getInfoAsync(path)).exists) throw new Error('File already exists');
    await FileSystem.writeAsStringAsync(path, content);
    return path;
  }

  async readTextFile(path: string): Promise<string> {
    const info = await FileSystem.getInfoAsync(path, { size: true });
    if (!info.exists || info.isDirectory) throw new Error('Invalid file');
    return FileSystem.readAsStringAsync(path);
  }

  async updateTextFile(path: string, content: string): Promise<void> {
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists || info.isDirectory) throw new Error('Invalid file');
    await FileSystem.writeAsStringAsync(path, content);
  }

  async deleteEntry(path: string): Promise<void> {
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) throw new Error('Entry does not exist');
    await FileSystem.deleteAsync(path, { idempotent: true });
  }

  async getFileDetails(path: string) {
    const info = await FileSystem.getInfoAsync(path, { size: true });
    if (!info.exists) throw new Error('Entry does not exist');
    const name = path.split('/').pop() || '';
    const ext = name.includes('.') ? name.split('.').pop() : '';
    return { name, type: info.isDirectory ? 'Directory' : ext?.toUpperCase() || 'Unknown', size: info.size || 0, modificationTime: info.modificationTime || 0, isDirectory: info.isDirectory };
  }
}

function ensureSlash(p: string): string {
  return p.endsWith('/') ? p : p + '/';
}
function normalizeNoSlash(p: string): string {
  return p.endsWith('/') ? p.slice(0, -1) : p;
}

export const fileSystemService = new FileSystemService();