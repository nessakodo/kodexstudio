import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function downloadResume(): void {
  const link = document.createElement('a');
  link.href = '/api/resume';
  link.download = 'nessa-kodo-resume.pdf';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
