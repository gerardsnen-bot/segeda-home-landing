import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/catalogo");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#fffdf9] via-[#faf7ef] to-[#f3ead8] px-4">
      <Card className="w-full max-w-lg border border-[#b99137]/25 bg-white/90 shadow-xl shadow-[#171717]/10 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#f5efe3]" />
              <AlertCircle className="relative h-16 w-16 text-[#b99137]" />
            </div>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-[#8b6a24]">MDFantasy</p>
          <h1 className="mb-2 font-serif text-5xl font-semibold text-[#171717]">404</h1>

          <h2 className="mb-4 font-serif text-2xl text-[#171717]">
            Página no encontrada
          </h2>

          <p className="mb-8 leading-relaxed text-[#655d54]">
            La página que buscas no está disponible.
            <br />
            Puede haber cambiado de ubicación o ya no existir.
          </p>

          <div
            id="not-found-button-group"
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={handleGoHome}
              className="rounded-full bg-[#171717] px-6 py-2.5 text-white transition-all duration-200 hover:bg-[#2b2b2b]"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir al catálogo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
