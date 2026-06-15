import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const GAME_DURATION = 30; // seconds
const TARGET_SPAWN_INTERVAL = 300; // ms
const TARGET_SIZE = 40; // px
const TARGET_LIFETIME = 1500; // ms

interface Target {
  id: string;
  x: number;
  y: number;
  createdAt: number;
}

export default function AimTrainerPage() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 p-8 text-center">
          <p className="text-white mb-4">Faça login para jogar</p>
          <Button onClick={() => setLocation("/")} className="bg-amber-500 hover:bg-amber-600">
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  return <AimTrainerGame setLocation={setLocation} />;
}

function AimTrainerGame({ setLocation }: { setLocation: (path: string) => void }) {
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [targetsHit, setTargetsHit] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [gameResult, setGameResult] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const spawnTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const cleanupTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const submitScoreMutation = trpc.aimTrainer.submitScore.useMutation();



  const handleTargetClick = useCallback((targetId: string) => {
    if (!gameActive) return;

    setTargets((prev) => prev.filter((t) => t.id !== targetId));
    setScore((prev) => prev + 10);
    setTargetsHit((prev) => prev + 1);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    }
  }, [gameActive]);

  const startGame = useCallback(() => {
    setGameActive(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setTargetsHit(0);
    setTotalTargets(0);
    setTargets([]);
    setGameResult(null);

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          setGameActive(false);
          if (gameTimerRef.current) clearInterval(gameTimerRef.current);
          if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    spawnTimerRef.current = setInterval(() => {
      const newTarget: Target = {
        id: Math.random().toString(),
        x: Math.random() * (containerRef.current?.clientWidth || 800 - TARGET_SIZE),
        y: Math.random() * (containerRef.current?.clientHeight || 400 - TARGET_SIZE),
        createdAt: Date.now(),
      };
      setTargets((prev) => [...prev, newTarget]);
      setTotalTargets((prev) => prev + 1);
    }, TARGET_SPAWN_INTERVAL);
  }, []);

  useEffect(() => {
    if (gameActive && timeLeft === 0) {
      setGameActive(false);
      const accuracy = totalTargets > 0 ? (targetsHit / totalTargets) * 100 : 0;

      setGameResult({
        score,
        targetsHit,
        totalTargets,
        accuracy: Math.round(accuracy * 100) / 100,
      });

      // Submit score to server
      submitScoreMutation.mutate(
        {
          score,
          targetsHit,
          totalTargets,
          accuracy,
          caseId: 1,
        },
        {
          onSuccess: (data) => {
            toast.success(`Você ganhou ${data.keysEarned} chaves!`);
          },
          onError: () => {
            toast.error("Erro ao salvar pontuação");
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Clean up old targets
  useEffect(() => {
    cleanupTimerRef.current = setInterval(() => {
      const now = Date.now();
      setTargets((prev) =>
        prev.filter((target) => now - target.createdAt < TARGET_LIFETIME)
      );
    }, 100);

    return () => {
      if (cleanupTimerRef.current) {
        clearInterval(cleanupTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-white">Aim Trainer</h1>
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

      <section className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-white/5 border-white/10 p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Tempo</p>
              <p className="text-3xl font-bold text-white">{timeLeft}s</p>
            </Card>
            <Card className="bg-white/5 border-white/10 p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Pontuação</p>
              <p className="text-3xl font-bold text-amber-400">{score}</p>
            </Card>
            <Card className="bg-white/5 border-white/10 p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Alvos Acertados</p>
              <p className="text-3xl font-bold text-white">{targetsHit}</p>
            </Card>
            <Card className="bg-white/5 border-white/10 p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Precisão</p>
              <p className="text-3xl font-bold text-white">
                {totalTargets > 0 ? Math.round((targetsHit / totalTargets) * 100) : 0}%
              </p>
            </Card>
          </div>

          {/* Game Area */}
          <div
            ref={containerRef}
            className="relative w-full h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 overflow-hidden cursor-crosshair"
          >
            {!gameActive && !gameResult && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg px-8"
                >
                  Iniciar Jogo
                </Button>
              </div>
            )}

            {/* Targets */}
            {targets.map((target) => (
              <button
                key={target.id}
                onClick={() => handleTargetClick(target.id)}
                className="absolute w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full hover:from-red-400 hover:to-red-500 transition-all transform hover:scale-110 shadow-lg shadow-red-500/50 border-2 border-red-300"
                style={{
                  left: `${target.x}px`,
                  top: `${target.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="absolute inset-1 bg-red-400 rounded-full opacity-50 animate-pulse" />
              </button>
            ))}

            {/* Game Over Screen */}
            {gameResult && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-white/20 p-8 text-center space-y-6 max-w-md">
                  <h2 className="text-3xl font-bold text-white">Jogo Finalizado!</h2>

                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-1">Pontuação Final</p>
                      <p className="text-4xl font-bold text-amber-400">{gameResult.score}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Alvos Acertados</p>
                        <p className="text-2xl font-bold text-white">{gameResult.targetsHit}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Precisão</p>
                        <p className="text-2xl font-bold text-white">{gameResult.accuracy}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                    <p className="text-sm text-green-400 font-semibold">
                      +{Math.floor(gameResult.score / 10)} chaves ganhas!
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={startGame}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold"
                    >
                      Jogar Novamente
                    </Button>
                    <Button
                      onClick={() => setLocation("/cases")}
                      variant="outline"
                      className="flex-1 border-white/10 text-gray-400 hover:text-white"
                    >
                      Abrir Caixas
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Instructions */}
          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-3">Como Jogar</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Clique nos alvos (bolinhas vermelhas) que aparecem na tela</li>
              <li>• Você tem 30 segundos para acertar o máximo de alvos possível</li>
              <li>• Cada alvo acertado = 10 pontos</li>
              <li>• 1 chave é ganha a cada 10 pontos (mínimo 10 pontos)</li>
              <li>• Quanto maior sua precisão, melhor sua pontuação!</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}
