
import Terminal from "../components/Terminal";
import { Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 lg:p-12">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-mono text-primary mb-6 text-center">WellBeing.sh</h1>
        <Terminal />
        <div className="mt-8 text-xs text-muted-foreground text-center flex items-center justify-center">
          <Heart size={12} className="inline-block mr-1 text-primary" />
          <span>Open Source Mental Health Support • Not a replacement for professional help</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
