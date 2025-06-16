"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  BarChart3,
  Users,
  Music2,
  Download,
  TrendingUp,
  Calendar,
  Activity,
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert-simple";

interface Statistics {
  totalMusics: number;
  totalUsers: number;
  totalDownloads: number;
  pendingSubmissions: number;
  approvedMusics: number;
  rejectedMusics: number;
  recentActivity: {
    date: string;
    downloads: number;
    submissions: number;
  }[];
  topGenres: {
    genre: string;
    count: number;
  }[];
  topMusics: {
    id: string;
    title: string;
    artist: string;
    downloads: number;
  }[];
}

export default function Statistics() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/statistics');
        if (!response.ok) throw new Error('Erro ao carregar estatísticas');
        
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Carregando estatísticas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) return null;

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    trend,
    color = "text-primary" 
  }: {
    title: string;
    value: string | number;
    icon: any;
    description?: string;
    trend?: string;
    color?: string;
  }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-center space-x-2">
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <span className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-primary" />
          Estatísticas
        </h1>
        <p className="text-muted-foreground">Visão geral do sistema</p>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Músicas"
          value={stats.totalMusics}
          icon={Music2}
          description="Músicas no sistema"
          color="text-blue-500"
        />
        <StatCard
          title="Total de Usuários"
          value={stats.totalUsers}
          icon={Users}
          description="Usuários registrados"
          color="text-green-500"
        />
        <StatCard
          title="Total de Downloads"
          value={stats.totalDownloads.toLocaleString()}
          icon={Download}
          description="Downloads realizados"
          color="text-purple-500"
        />
        <StatCard
          title="Submissões Pendentes"
          value={stats.pendingSubmissions}
          icon={Clock}
          description="Aguardando aprovação"
          color="text-yellow-500"
        />
      </div>

      {/* Status das Músicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Músicas Aprovadas"
          value={stats.approvedMusics}
          icon={CheckCircle}
          description="Disponíveis publicamente"
          color="text-green-500"
        />
        <StatCard
          title="Músicas Rejeitadas"
          value={stats.rejectedMusics}
          icon={XCircle}
          description="Não aprovadas"
          color="text-red-500"
        />
        <StatCard
          title="Taxa de Aprovação"
          value={`${Math.round((stats.approvedMusics / (stats.approvedMusics + stats.rejectedMusics)) * 100)}%`}
          icon={Activity}
          description="Músicas aprovadas vs total"
          color="text-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gêneros Mais Populares */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Gêneros Mais Populares
          </h3>
          <div className="space-y-3">
            {stats.topGenres.map((genre, index) => (
              <div key={genre.genre} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium">{genre.genre}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${(genre.count / stats.topGenres[0].count) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {genre.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Músicas Mais Baixadas */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Músicas Mais Baixadas
          </h3>
          <div className="space-y-3">
            {stats.topMusics.map((music, index) => (
              <div key={music.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{music.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{music.artist}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Download className="h-3 w-3 mr-1" />
                  {music.downloads}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Atividade Recente */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Atividade dos Últimos 7 Dias
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {stats.recentActivity.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-muted-foreground mb-2">
                {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
              </div>
              <div className="space-y-1">
                <div className="bg-blue-100 rounded p-2">
                  <div className="text-xs text-blue-800">Downloads</div>
                  <div className="font-bold text-blue-900">{day.downloads}</div>
                </div>
                <div className="bg-green-100 rounded p-2">
                  <div className="text-xs text-green-800">Submissões</div>
                  <div className="font-bold text-green-900">{day.submissions}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
