interface TypingIndicatorProps {
  label?: string;
}

const TypingIndicator = ({ label = "Thinking" }: TypingIndicatorProps) => {
  return (
    <div className="flex items-center text-primary" aria-label={`${label}...`} role="status" aria-live="polite">
      <span className="font-bold mr-2 text-primary" aria-hidden="true">{'>'}</span>
      <span>{label}</span>
      <span className="flex ml-0.5 gap-0.5" aria-hidden="true">
        <span className="animate-pulse duration-1000" style={{ animationDelay: '0ms' }}>.</span>
        <span className="animate-pulse duration-1000" style={{ animationDelay: '200ms' }}>.</span>
        <span className="animate-pulse duration-1000" style={{ animationDelay: '400ms' }}>.</span>
      </span>
    </div>
  );
};

export default TypingIndicator;
