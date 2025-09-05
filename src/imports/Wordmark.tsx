import { imgWordmark } from "./svg-2xw9o";

export default function Wordmark() {
  return (
    <div className="relative w-auto h-full" data-name="Wordmark" style={{ color: 'var(--sidebar-primary, #009FE3)' }}>
      <img 
        className="block w-auto h-full object-contain" 
        src={imgWordmark} 
        alt="ZeroH Wordmark"
        style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(119%) contrast(119%)' }}
      />
    </div>
  );
}