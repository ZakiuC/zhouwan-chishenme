"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { MAP_PROVIDERS } from "@/lib/constants";

interface SearchResult {
  name: string;
  address: string;
  longitude: number;
  latitude: number;
}

const MAP_OPTIONS = MAP_PROVIDERS.map((mp) => ({ value: mp.value, label: mp.label }));

interface MapSearchProps {
  onSelect: (result: SearchResult, provider: string) => void;
  onClose: () => void;
}

export function MapSearch({ onSelect, onClose }: MapSearchProps) {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [provider, setProvider] = useState("AMAP");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const p = new URLSearchParams({ keyword: keyword.trim(), provider });
      if (city.trim()) p.set("city", city.trim());
      const res = await fetch(`/api/map/search?${p.toString()}`);
      const d = await res.json();
      if (d.error && !d.results?.length) {
        setError(d.error);
        setResults([]);
      } else {
        setResults(d.results || []);
      }
    } catch {
      setError("搜索失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (r: SearchResult) => {
    onSelect(r, provider);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-ink-100 text-sm select-none flex items-center gap-1">
          <Icon name="search" size={14} />搜索店铺
        </h4>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <Icon name="cross" size={14} />
        </Button>
      </div>

      <div className="flex gap-2">
        <Select value={provider} onChange={setProvider} options={MAP_OPTIONS} className="w-20" />
        <Input
          placeholder="搜索店铺名称..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <div className="flex gap-2">
        <Input placeholder="城市（可选，如：北京）" value={city} onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
        <Button onClick={handleSearch} loading={loading} className="shrink-0">
          <Icon name="search" size={14} className="mr-1" />搜索
        </Button>
      </div>

      {error && <p className="text-xs text-rust-400">{error}</p>}

      {results.length > 0 && (
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {results.map((r, i) => (
            <Card key={i} padding="sm" onClick={() => handleSelect(r)}
              className="cursor-pointer hover:border-caramel-500/30 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-50 truncate">{r.name}</p>
                  <p className="text-2xs text-ink-500 truncate mt-0.5">{r.address}</p>
                </div>
                <span className="text-2xs text-caramel-400 shrink-0 mt-1">选择</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {searched && !loading && results.length === 0 && !error && (
        <p className="text-xs text-ink-500 text-center py-4">未找到结果</p>
      )}
    </div>
  );
}
