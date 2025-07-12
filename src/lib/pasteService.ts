import { db } from './firebase';
import { collection, doc, setDoc, getDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface Paste {
  id: string;
  title: string;
  content: string;
  language: string;
  authorId?: string;
  authorName: string;
  visibility: 'public' | 'private';
  createdAt: string;
  viewCount: number;
  url: string;
}

export const createPaste = async (
  pasteData: Omit<Paste, 'id' | 'createdAt' | 'viewCount' | 'url'>,
  user?: User | null
): Promise<Paste> => {
  const pasteId = Math.random().toString(36).substring(2, 10);
  const url = `${window.location.origin}/paste/${pasteId}`;
  
  const paste: Paste = {
    ...pasteData,
    id: pasteId,
    authorId: user?.uid,
    authorName: user?.displayName || user?.email || 'Anonymous',
    createdAt: new Date().toISOString(),
    viewCount: 0,
    url
  };

  try {
    await setDoc(doc(db, 'pastes', pasteId), paste);
    return paste;
  } catch (error) {
    console.error('Error creating paste:', error);
    throw new Error('Failed to create paste');
  }
};

export const getPaste = async (pasteId: string): Promise<Paste | null> => {
  try {
    const pasteDoc = await getDoc(doc(db, 'pastes', pasteId));
    
    if (!pasteDoc.exists()) {
      return null;
    }

    const paste = pasteDoc.data() as Paste;
    
    // Increment view count
    await setDoc(doc(db, 'pastes', pasteId), {
      ...paste,
      viewCount: (paste.viewCount || 0) + 1
    });

    return { ...paste, viewCount: (paste.viewCount || 0) + 1 };
  } catch (error) {
    console.error('Error fetching paste:', error);
    throw new Error('Failed to fetch paste');
  }
};

export const getUserPastes = async (userId: string): Promise<Paste[]> => {
  try {
    const q = query(
      collection(db, 'pastes'),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Paste);
  } catch (error) {
    console.error('Error fetching user pastes:', error);
    return [];
  }
};

export const downloadPaste = (paste: Paste): void => {
  const fileExtension = getFileExtension(paste.language);
  const fileName = `${paste.title || `paste-${paste.id}`}.${fileExtension}`;
  
  const blob = new Blob([paste.content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

const getFileExtension = (language: string): string => {
  const extensions: Record<string, string> = {
    javascript: 'js',
    python: 'py',
    java: 'java',
    html: 'html',
    css: 'css',
    json: 'json',
    xml: 'xml',
    sql: 'sql',
    typescript: 'ts',
    php: 'php',
    cpp: 'cpp',
    c: 'c',
    ruby: 'rb',
    go: 'go',
    rust: 'rs',
    swift: 'swift',
    kotlin: 'kt',
    text: 'txt'
  };
  
  return extensions[language] || 'txt';
};