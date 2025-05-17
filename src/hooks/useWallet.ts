import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface WalletData {
  walletStatus: 'not_configured' | 'pending' | 'active';
  walletSetupDeadline?: string;
  escrowAmount: number;
  availableAmount: number;
}

export function useWallet() {
  const [walletData, setWalletData] = useState<WalletData>({
    walletStatus: 'not_configured',
    escrowAmount: 0,
    availableAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user's wallet status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('wallet_status, wallet_setup_deadline')
        .single();

      if (profileError) throw profileError;

      // Fetch contributions in escrow
      const { data: escrowData, error: escrowError } = await supabase
        .from('gift_contributions')
        .select('amount')
        .eq('escrow_status', 'in_escrow');

      if (escrowError) throw escrowError;

      // Fetch available contributions
      const { data: availableData, error: availableError } = await supabase
        .from('gift_contributions')
        .select('amount')
        .eq('escrow_status', 'transferred');

      if (availableError) throw availableError;

      // Calculate total amounts
      const escrowAmount = escrowData?.reduce((sum, item) => sum + item.amount, 0) || 0;
      const availableAmount = availableData?.reduce((sum, item) => sum + item.amount, 0) || 0;

      setWalletData({
        walletStatus: profileData.wallet_status || 'not_configured',
        walletSetupDeadline: profileData.wallet_setup_deadline,
        escrowAmount,
        availableAmount,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel recupero dei dati del wallet');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  return { walletData, loading, error, refetch: fetchWalletData };
} 