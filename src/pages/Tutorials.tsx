import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Search, Play, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getYouTubeThumbnail } from "@/lib/youtube-utils";
import { useTranslation } from "react-i18next";

// API Services
const fetchTutorials = async () => {
  return apiClient.get("/tutorials/search");
};

const categories = ["All", "Form Guide", "Workout Tips", "Nutrition", "Recovery"];

export function Tutorials() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: tutorialsResponse, isLoading } = useQuery({
    queryKey: ["tutorials"],
    queryFn: fetchTutorials,
  });

  const tutorials = (tutorialsResponse as any)?.data?.items;

  const filteredTutorials = tutorials?.filter((t: any) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || (t.type && t.type === selectedCategory.toUpperCase().replace(" ", "_"));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('menu.tutorials')}</h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('common.search')}
              className="pl-8 bg-card"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Hero Featured Video */}
      {!isLoading && filteredTutorials?.length > 0 && (
         <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-card shadow-2xl group cursor-pointer">
            <img 
                src={filteredTutorials[0].thumbnailUrl || getYouTubeThumbnail(filteredTutorials[0].videoUrl || "") || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"} 
                alt="Featured Tutorial" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <Badge className="mb-3 bg-primary/20 text-primary border-primary/50 backdrop-blur-sm">Featured</Badge>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{filteredTutorials[0].title}</h2>
                <p className="text-muted-foreground line-clamp-2 max-w-2xl mb-4">{filteredTutorials[0].summary}</p>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                        <Play className="h-5 w-5 fill-current" />
                        {t('common.start')}
                    </button>
                    <button className="h-11 w-11 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all">
                        <Bookmark className="h-5 w-5" />
                    </button>
                </div>
            </div>
         </div>
      )}

      {/* Categories */}
      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border",
              selectedCategory === cat
                ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-card border-border text-muted-foreground hover:border-primary/50"
            )}
          >
            {cat === "All" ? t('common.all') : cat}
          </button>
        ))}
      </div>

      {/* Tutorial Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
                <div className="aspect-video w-full animate-pulse rounded-xl bg-card border border-border/50" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-card" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-card" />
            </div>
          ))
        ) : (
          filteredTutorials?.map((tutorial: any) => (
            <Card key={tutorial.id} className="group border-none bg-transparent shadow-none cursor-pointer overflow-hidden">
              <CardContent className="p-0 space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-card">
                  <img 
                    src={tutorial.thumbnailUrl || getYouTubeThumbnail(tutorial.videoUrl || "")} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    alt={tutorial.title}
                  />
                  <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                    {tutorial.videoDuration ? `${Math.floor(tutorial.videoDuration / 60)}:${(tutorial.videoDuration % 60).toString().padStart(2, '0')}` : '0:00'}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground shadow-xl scale-90 group-hover:scale-100 transition-transform">
                        <Play className="h-6 w-6 fill-current ml-1" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{tutorial.type?.replace('_', ' ')}</span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{tutorial.difficulty}</span>
                  </div>
                  <h3 className="font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">{tutorial.title}</h3>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
