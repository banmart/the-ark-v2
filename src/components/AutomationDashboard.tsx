
import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AutomationLog {
  id: string;
  execution_time: string;
  operation: string;
  status: string;
  transaction_hash?: string;
  gas_used?: number;
  error_message?: string;
  details?: any;
}

const AutomationDashboard = () => {
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('automation_logs')
        .select('*')
        .order('execution_time', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching automation logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
      case 'critical_error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'skipped':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'critical_error':
        return 'bg-red-100 text-red-800';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatOperation = (operation: string) => {
    return operation
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const triggerManualExecution = async () => {
    try {
      setLoading(true);
      const response = await supabase.functions.invoke('automated-rewards', {
        body: { trigger: 'manual', timestamp: new Date().toISOString() }
      });

      if (response.error) throw response.error;
      
      // Refresh logs after manual execution
      setTimeout(fetchLogs, 2000);
    } catch (err: any) {
      console.error('Manual execution failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400">Automation Dashboard</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={triggerManualExecution}
                disabled={loading}
                className="border-cyan-500/30 hover:bg-cyan-500/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Manual Trigger
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchLogs}
                disabled={loading}
                className="border-cyan-500/30 hover:bg-cyan-500/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No automation logs found
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="glass-card p-4 rounded-lg border border-cyan-500/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <div className="font-semibold text-white">
                          {formatOperation(log.operation)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(log.execution_time).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </div>

                  {log.transaction_hash && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-400">TX: </span>
                      <a
                        href={`https://scan.pulsechain.com/tx/${log.transaction_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-mono"
                      >
                        {log.transaction_hash.slice(0, 10)}...{log.transaction_hash.slice(-8)}
                      </a>
                    </div>
                  )}

                  {log.gas_used && (
                    <div className="mt-1 text-sm text-gray-400">
                      Gas Used: {log.gas_used.toLocaleString()}
                    </div>
                  )}

                  {log.error_message && (
                    <div className="mt-2 text-sm text-red-400 bg-red-900/20 p-2 rounded">
                      {log.error_message}
                    </div>
                  )}

                  {log.details && (
                    <div className="mt-2 text-xs text-gray-500">
                      <pre className="bg-gray-900/50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationDashboard;
