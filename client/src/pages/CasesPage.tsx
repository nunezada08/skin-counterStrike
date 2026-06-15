import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Lock, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function CasesPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [keyBalances, setKeyBalances] = useState<Record<number, number>>({});

  const casesQuery = trpc.cases.list.useQuery();
  const keysQuery = trpc.keys.getAllBalances.useQuery(undefined, { enabled: isAuthenticated });

  useEffect(() => {
    if (keysQuery.data) {
      const balances: Record<number, number> = {};
      keysQuery.data.forEach((key) => {
        balances[key.caseId] = key.balance;
      });
      setKeyBalances(balances);
    }
  }, [keysQuery.data]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 p-8 text-center">
          <p className="text-white mb-4">Faça login para acessar as caixas</p>
          <Button onClick={() => setLocation("/")} className="bg-amber-500 hover:bg-amber-600">
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-white">Caixas Disponíveis</h1>
          <div className="flex gap-3">
            <Button
              onClick={() => setLocation("/aim-trainer")}
              variant="outline"
              className="border-white/10 text-gray-400 hover:text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Aim Trainer
            </Button>
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="border-white/10 text-gray-400 hover:text-white"
            >
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Cases Grid */}
      <section className="container py-12">
        {casesQuery.isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : casesQuery.data && casesQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {casesQuery.data.map((caseItem) => {
              const keyBalance = keyBalances[caseItem.id] || 0;
              const hasKey = keyBalance > 0;

              return (
                <div
                  key={caseItem.id}
                  className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300"
                >
                  {/* Case Image Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/10 group-hover:from-amber-500/20 group-hover:to-orange-600/20 transition-all" />
                    {caseItem.image ? (
                      <img
                        src={caseItem.image}
                        alt={caseItem.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-600/30 flex items-center justify-center">
                          <Lock className="w-8 h-8 text-amber-400" />
                        </div>
                        <p className="text-sm text-gray-500">{caseItem.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Case Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{caseItem.name}</h3>
                      <p className="text-sm text-gray-400">{caseItem.description || "Caixa de CS2"}</p>
                    </div>

                    {/* Key Balance */}
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                      <span className="text-sm text-gray-400">Chaves disponíveis</span>
                      <span className={`text-lg font-bold ${hasKey ? "text-amber-400" : "text-gray-500"}`}>
                        {keyBalance}
                      </span>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => setLocation(`/case/${caseItem.id}`)}
                      disabled={!hasKey}
                      className={`w-full font-bold transition-all ${
                        hasKey
                          ? "bg-amber-500 hover:bg-amber-600 text-black"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {hasKey ? "Abrir Caixa" : "Sem Chaves"}
                    </Button>

                    {!hasKey && (
                      <Button
                        onClick={() => setLocation("/aim-trainer")}
                        variant="outline"
                        className="w-full border-white/10 text-gray-400 hover:text-white"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Ganhar Chaves
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">Nenhuma caixa disponível no momento</p>
          </div>
        )}
      </section>
    </div>
  );
}
