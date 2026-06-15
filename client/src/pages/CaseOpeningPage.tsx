import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const CARD_W = 128;
const CARD_GAP = 8;

export default function CaseOpeningPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/case/:caseId");
  const caseId = params?.caseId ? parseInt(params.caseId) : null;

  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const [reel, setReel] = useState<any[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  const caseQuery = trpc.cases.getSkins.useQuery({ caseId: caseId || 0 }, { enabled: !!caseId });
  const openCaseMutation = trpc.caseOpening.openCase.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 p-8 text-center">
          <p className="text-white mb-4">Faça login para abrir caixas</p>
          <Button onClick={() => setLocation("/")} className="bg-amber-500 hover:bg-amber-600">
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  const pickWeightedSkin = (skins: any[]) => {
    const pool: any[] = [];
    skins.forEach((skin) => {
      const weight = skin.weight || 1;
      for (let i = 0; i < weight; i++) pool.push(skin);
    });
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const buildReel = (skins: any[], winnerSkin: any, totalItems = 60) => {
    const WINNER_IDX = totalItems - 8;
    const items = [];
    for (let i = 0; i < totalItems; i++) {
      items.push(i === WINNER_IDX ? winnerSkin : pickWeightedSkin(skins));
    }
    return { items, winnerIdx: WINNER_IDX };
  };

  const openCase = () => {
    if (spinning || !caseId) return;

    openCaseMutation.mutate(
      { caseId },
      {
        onSuccess: (data) => {
          const winnerSkin = data.skin;
          const { items, winnerIdx } = buildReel(caseQuery.data || [], winnerSkin);
          setReel(items);
          setSpinning(true);
          setWinner(null);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (!trackRef.current) return;

              trackRef.current.style.transition = "none";
              trackRef.current.style.transform = "translateX(0px)";

              const targetX = winnerIdx * (CARD_W + CARD_GAP) + CARD_W / 2;

              void trackRef.current.offsetWidth;

              trackRef.current.style.transition = "transform 5s cubic-bezier(0.1, 0.8, 0.2, 1)";
              trackRef.current.style.transform = `translateX(-${targetX}px)`;

              setTimeout(() => {
                setSpinning(false);
                setWinner(winnerSkin);
              }, 5200);
            });
          });
        },
        onError: (error: any) => {
          toast.error(error.message || "Erro ao abrir caixa");
        },
      }
    );
  };

  const reset = () => {
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = "translateX(0)";
    }
    setReel([]);
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-white">Abrir Caixa</h1>
          <Button
            onClick={() => setLocation("/cases")}
            variant="outline"
            className="border-white/10 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <section className="container py-12">
        {caseQuery.isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Reel */}
            <div className="relative bg-[#0d0d14] border border-white/10 rounded-xl h-40 overflow-hidden">
              {/* Yellow line indicator */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-px z-20 pointer-events-none">
                <div className="w-0.5 h-full bg-[#f0a500]/80" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-[#f0a500]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-[#f0a500]" />
              </div>

              {/* Gradient overlays */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0d0d14] to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0d0d14] to-transparent z-10 pointer-events-none" />

              {reel.length > 0 ? (
                <div className="absolute inset-y-0 flex items-center" style={{ left: "50%" }}>
                  <div ref={trackRef} className="flex gap-2" style={{ willChange: "transform" }}>
                    {reel.map((skin, i) => (
                      <div
                        key={i}
                        className="shrink-0 w-32 h-32 bg-[#111118] rounded-lg border border-white/5 overflow-hidden flex flex-col items-center justify-center p-2"
                        style={{ borderTopColor: skin.rarityColor || "#888", borderTopWidth: 2 }}
                      >
                        <img
                          src={skin.image}
                          alt={skin.name}
                          className="h-16 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <p className="text-[9px] text-gray-400 text-center leading-tight mt-1 line-clamp-2">
                          {skin.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-600 text-sm">Pressione abrir para começar</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={openCase}
                disabled={spinning}
                className="px-10 py-3 bg-[#f0a500] text-black font-bold rounded-xl hover:bg-[#f0a500]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm tracking-wide shadow-lg shadow-[#f0a500]/20"
              >
                {spinning ? "Abrindo..." : "Abrir Caixa"}
              </Button>
              {(winner || reel.length > 0) && !spinning && (
                <Button
                  onClick={reset}
                  className="px-6 py-3 border border-white/10 text-gray-400 font-semibold rounded-xl hover:border-white/30 hover:text-white transition-all text-sm"
                >
                  Resetar
                </Button>
              )}
            </div>

            {/* Winner Display */}
            {winner && (
              <div
                className="bg-[#111118] border rounded-2xl p-6 text-center space-y-3 transition-all"
                style={{ borderColor: (winner.rarityColor || "#888") + "66" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: winner.rarityColor }}>
                  🎉 Você desbloqueou
                </p>
                <div className="flex justify-center">
                  <img
                    src={winner.image}
                    alt={winner.name}
                    className="h-28 object-contain drop-shadow-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <h3 className="text-white font-bold text-xl">{winner.name}</h3>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="font-bold" style={{ color: winner.rarityColor }}>
                    {winner.rarity}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
