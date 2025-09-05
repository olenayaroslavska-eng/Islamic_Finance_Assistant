import { imgWordmark } from "./svg-l298a";

export default function Wordmark() {
  return (
    <div className="relative" data-name="Wordmark">
      <img 
        className="block w-[150px] h-[33px] object-contain" 
        src={imgWordmark} 
        alt="ZeroH Wordmark"
        style={{ filter: 'brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(119%) contrast(119%)' }}
      />
    </div>
  );
}