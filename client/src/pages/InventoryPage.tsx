import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { ArrowLeft, Filter } from "lucide-react";
import { useState } from "react";

export default function InventoryPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [filterRarity, setFilterRarity] = useState<string | undefined>();
  const [filterCase, setFilterCase] = useState<string | undefined>();

  const inventoryQuery = trpc.inventory.getInventory.useQuery(undefined, { enabled: isAuthenticated });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 p-8 text-center">
          <p className="text-white mb-4">Faça login para ver seu inventário</p>
          <Button onClick={() => setLocation("/")} className="bg-amber-500 hover:bg-amber-600">
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  const items = inventoryQuery.data || [];
  const rarities = Array.from(new Set(items.map((i) => i.skinRarity))).sort();
  const caseNames = Array.from(new Set(items.map((i) => i.caseName))).sort();
  const filteredItems = items.filter((i) => {
    const rarityMatch = !filterRarity || i.skinRarity === filterRarity;
    const caseMatch = !filterCase || i.caseName === filterCase;
    return rarityMatch && caseMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Inventário</h1>
            <p className="text-sm text-gray-400">{items.length} itens</p>
          </div>
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
        {inventoryQuery.isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                onClick={() => setFilterRarity(undefined)}
                variant={filterRarity === undefined ? "default" : "outline"}
                className={filterRarity === undefined ? "bg-amber-500 text-black" : "border-white/10"}
              >
                Todas
              </Button>
              {rarities.map((rarity) => (
                <Button
                  key={rarity}
                  onClick={() => setFilterRarity(rarity || undefined)}
                  variant={filterRarity === rarity ? "default" : "outline"}
                  className={filterRarity === rarity ? "bg-amber-500 text-black" : "border-white/10"}
                >
                  {rarity}
                </Button>
              ))}
              {caseNames.length > 0 && <div className="w-px bg-white/10" />}
              {caseNames.map((caseName) => (
                <Button
                  key={caseName}
                  onClick={() => setFilterCase(caseName || undefined)}
                  variant={filterCase === caseName ? "default" : "outline"}
                  className={filterCase === caseName ? "bg-amber-500 text-black" : "border-white/10"}
                >
                  {caseName}
                </Button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] border-2 overflow-hidden hover:border-amber-500/50 transition-all"
                  style={{ borderColor: `${item.skinRarityColor || "#888"}66` }}
                >
                  {/* Skin Image */}
                  <div className="relative h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{ backgroundColor: item.skinRarityColor || "#888" }}
                    />
                    {item.skinImage ? (
                      <img
                        src={item.skinImage}
                        alt={item.skinName || "Skin"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Sem imagem</p>
                      </div>
                    )}
                  </div>

                  {/* Skin Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-white truncate">{item.skinName || "Unknown"}</h3>
                      <p className="text-xs text-gray-400">{item.caseName || "Unknown Case"}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded"
                        style={{
                          color: item.skinRarityColor || "#888",
                          backgroundColor: `${item.skinRarityColor || "#888"}20`,
                        }}
                      >
                        {item.skinRarity}
                      </span>
                      <span className="text-sm text-gray-400">×{item.quantity}</span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Obtido em {new Date(item.obtainedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Seu inventário está vazio</p>
            <Button
              onClick={() => setLocation("/cases")}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
            >
              Abrir Caixas
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
