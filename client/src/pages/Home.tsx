import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Zap, Target, Box, Package } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Box,
      title: "Abrir Caixas",
      description: "Abra caixas de CS2 e ganhe skins raras",
      href: "/cases",
    },
    {
      icon: Target,
      title: "Aim Trainer",
      description: "Treino de mira para ganhar chaves",
      href: "/aim-trainer",
    },
    {
      icon: Package,
      title: "Inventário",
      description: "Veja todas as skins que você conquistou",
      href: "/inventory",
    },
    {
      icon: Zap,
      title: "Estatísticas",
      description: "Acompanhe seu progresso e recordes",
      href: "#stats",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Box className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">CS Case Simulator</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="text-sm text-gray-400">
                  Bem-vindo, <span className="text-white font-semibold">{user?.name}</span>
                </div>
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-gray-400 hover:text-white"
                >
                  Sair
                </Button>
              </>
            ) : (
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-5xl font-black text-white tracking-tight">
            Simulador de Abertura de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Caixas CS2</span>
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Experimente a emoção de abrir caixas de Counter-Strike 2. Ganhe chaves no Aim Trainer, abra caixas e construa seu inventário de skins raras.
          </p>
          {isAuthenticated ? (
            <div className="flex gap-4 justify-center pt-4">
              <Button
                onClick={() => setLocation("/cases")}
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg px-8"
              >
                Começar a Jogar
              </Button>
              <Button
                onClick={() => setLocation("/inventory")}
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5"
              >
                Ver Inventário
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => window.location.href = getLoginUrl()}
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg px-8"
            >
              Fazer Login para Começar
            </Button>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-16">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Como Funciona</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.title}
                onClick={() => {
                  if (feature.href === "#stats") return;
                  if (!isAuthenticated) {
                    window.location.href = getLoginUrl();
                  } else {
                    setLocation(feature.href);
                  }
                }}
                className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300 text-left w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/5 rounded-xl transition-all duration-300" />
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center group-hover:from-amber-500/30 group-hover:to-orange-600/30 transition-all">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/30 backdrop-blur-sm mt-20">
        <div className="container py-8 text-center text-sm text-gray-500">
          <p>CS Case Simulator © 2026. Não é afiliado a Valve Corporation ou Counter-Strike.</p>
        </div>
      </footer>
    </div>
  );
}
