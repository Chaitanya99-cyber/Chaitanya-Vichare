import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyticsAPI } from '@/services/api';
import type { AnalyticsSummary } from '@/services/api';
import { 
  Eye, Users, MousePointer, Clock, TrendingUp,
  BarChart3, Calendar, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsAPI.getSummary(parseInt(dateRange));
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your website performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalytics} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cyber-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {analytics?.total_page_views?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics?.date_range}
            </p>
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {analytics?.unique_visitors?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Individual users
            </p>
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <MousePointer className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {analytics?.total_sessions?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Browsing sessions
            </p>
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {analytics?.avg_session_duration?.toFixed(1) || 0}s
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Time per session
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Pages
            </CardTitle>
            <CardDescription>Most visited pages on your website</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.top_pages && analytics.top_pages.length > 0 ? (
              <div className="space-y-3">
                {analytics.top_pages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{page.page || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">
                          {page.views} {page.views === 1 ? 'view' : 'views'}
                        </p>
                      </div>
                    </div>
                    <div className="text-primary font-semibold">
                      {page.views}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No page views recorded yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Quick Stats
            </CardTitle>
            <CardDescription>Additional insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Forms</p>
                <p className="text-2xl font-bold text-primary">
                  {analytics?.contact_form_submissions || 0}
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-primary/50" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pages/Session</p>
                <p className="text-2xl font-bold text-accent">
                  {analytics?.total_sessions && analytics?.total_page_views
                    ? (analytics.total_page_views / analytics.total_sessions).toFixed(1)
                    : '0.0'}
                </p>
              </div>
              <Eye className="h-8 w-8 text-accent/50" />
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Date Range</p>
              <p className="font-medium text-foreground">{analytics?.date_range}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="cyber-card border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/20 p-2">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Analytics Tracking Active</h3>
              <p className="text-sm text-muted-foreground">
                Your website is tracking page views and visitor data. Analytics are updated in real-time as visitors browse your site.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
