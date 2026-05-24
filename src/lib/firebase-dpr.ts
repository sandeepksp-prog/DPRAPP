import { ref, push, set } from "firebase/database";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase/client";

const DRAFT_KEY = 'ksppl_dpr_draft_data';

export const saveDraftData = (data: any) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, lastSaved: Date.now() }));
    }
  } catch (error) {
    console.error('Failed to save draft', error);
  }
};

export const getDraftData = () => {
  try {
    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        return JSON.parse(draft);
      }
    }
  } catch (error) {
    console.error('Failed to get draft', error);
  }
  return null;
};

export const clearDraftData = () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DRAFT_KEY);
    }
  } catch (error) {
    console.error('Failed to clear draft', error);
  }
};

export const uploadPhoto = async (file: File, submissionId: string, onProgress?: (progress: number) => void): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const fileRef = storageRef(storage, `dpr_photos/${submissionId}/${fileName}`);
    
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

export const submitDPR = async (data: any) => {
  try {
    const dprListRef = ref(db, 'dpr_submissions');
    const newDprRef = push(dprListRef);
    
    const payload = {
      ...data,
      timestamp: Date.now(),
      status: 'submitted'
    };

    await set(newDprRef, payload);
    clearDraftData(); // Clear the draft on successful submission
    return { success: true, id: newDprRef.key };
  } catch (error: any) {
    console.error('Error submitting DPR:', error);
    return { success: false, error: error.message };
  }
};
