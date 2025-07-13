import { db } from './firebase';
import { collection, doc, setDoc, getDoc, query, where, getDocs, addDoc } from 'firebase/firestore';
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
  try {
    console.log('Creating paste with data:', pasteData);
    console.log('Firebase db:', db);
    
    // Create paste object with initial data
    const initialPaste = {
      ...pasteData,
      authorId: user?.uid || null,
      authorName: user?.displayName || user?.email || 'Anonymous',
      createdAt: new Date().toISOString(),
      viewCount: 0
    };

    // Add document to Firestore - let Firebase generate the ID
    const docRef = await addDoc(collection(db, 'pastes'), initialPaste);
    console.log('Paste created successfully with ID:', docRef.id);
    
    // Create the final paste object with the generated ID and URL
    const finalPaste: Paste = {
      ...initialPaste,
      id: docRef.id,
      url: `${window.location.origin}/paste/${docRef.id}`
    };
    
    // Update the document with the final data including ID and URL
    await setDoc(doc(db, 'pastes', docRef.id), finalPaste);
    
    return finalPaste;
  } catch (error) {
    console.error('Error creating paste:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to create paste: ${error.message || 'Unknown error'}`);
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
      where('authorId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const pastes = querySnapshot.docs.map(doc => doc.data() as Paste);
    
    // Sort by createdAt descending
    return pastes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching user pastes:', error);
    return [];
  }
};

export const getRecentPublicPastes = async (limit: number = 20): Promise<Paste[]> => {
  try {
    const q = query(
      collection(db, 'pastes'),
      where('visibility', '==', 'public')
    );
    
    const querySnapshot = await getDocs(q);
    const pastes = querySnapshot.docs.map(doc => doc.data() as Paste);
    
    // Sort by createdAt descending and limit results
    return pastes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent public pastes:', error);
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