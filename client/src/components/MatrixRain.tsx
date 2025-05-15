import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const windowWidth = window.innerWidth;
    const numColumns = Math.floor(windowWidth / 36); // Adjust for spacing
    
    // Katakana-inspired characters
    const matrix = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    
    // Clear existing columns
    container.innerHTML = '';
    
    // Create columns
    for (let i = 0; i < numColumns; i++) {
      const column = document.createElement('div');
      column.className = 'matrix-column';
      column.style.left = `${i * 36}px`; // Set position
      
      // Create animation delay and duration variables
      const delay = Math.random() * 5;
      const duration = 15 + Math.random() * 10;
      
      column.style.animationDelay = `${delay}s`;
      column.style.animationDuration = `${duration}s`;
      
      const columnHeight = Math.floor(Math.random() * 15) + 15; // Random length 15-30
      
      // Create characters in column
      for (let j = 0; j < columnHeight; j++) {
        const char = document.createElement('div');
        char.textContent = matrix.charAt(Math.floor(Math.random() * matrix.length));
        char.style.opacity = j === 0 ? '0.8' : `${0.8 - j * 0.03}`;
        column.appendChild(char);
      }
      
      container.appendChild(column);
    }
    
    // Recreate the matrix rain when the window is resized significantly
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (Math.abs(currentWidth - windowWidth) > 100) {
        // We need to recreate the matrix rain with new dimensions
        const container = containerRef.current;
        if (container) {
          container.innerHTML = '';
          const newNumColumns = Math.floor(currentWidth / 36);
          
          for (let i = 0; i < newNumColumns; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = `${i * 36}px`;
            
            const delay = Math.random() * 5;
            const duration = 15 + Math.random() * 10;
            
            column.style.animationDelay = `${delay}s`;
            column.style.animationDuration = `${duration}s`;
            
            const columnHeight = Math.floor(Math.random() * 15) + 15;
            
            for (let j = 0; j < columnHeight; j++) {
              const char = document.createElement('div');
              char.textContent = matrix.charAt(Math.floor(Math.random() * matrix.length));
              char.style.opacity = j === 0 ? '0.8' : `${0.8 - j * 0.03}`;
              column.appendChild(char);
            }
            
            container.appendChild(column);
          }
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="matrix-rain" 
      aria-hidden="true"
    />
  );
}
