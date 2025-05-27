import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import RESUME from '../components/assets/Nessa_Kodo_Resume.pdf';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function typeText(
  text: string,
  callback: (text: string) => void,
  speed: number = 50
): Promise<void> {
  return new Promise((resolve) => {
    let i = 0;
    const typeInterval = setInterval(() => {
      callback(text.substring(0, i + 1));
      i++;
      
      if (i === text.length) {
        clearInterval(typeInterval);
        resolve();
      }
    }, speed);
  });
}

export async function typeSequence(
  texts: string[],
  callback: (text: string) => void,
  speed: number = 50,
  delayBetween: number = 500
): Promise<void> {
  for (let i = 0; i < texts.length; i++) {
    await typeText(texts[i], callback, speed);
    if (i < texts.length - 1) {
      await sleep(delayBetween);
    }
  }
}

export async function downloadResume(): Promise<void> {
  try {
    const response = await fetch(RESUME);
    if (!response.ok) throw new Error('Failed to fetch resume');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nessa-kodo-resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading resume:', error);
  }
}
