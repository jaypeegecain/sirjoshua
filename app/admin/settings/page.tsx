'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { Settings, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { BUSINESS_CONFIG, SUCCESS_MESSAGES, ERROR_MESSAGES, TIMING } from '@/src/lib/constants';

interface SettingsState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

interface AppSettings {
  siteName: string;
  taxRate: number;
  shippingCost: number;
  currency: string;
  freeShippingThreshold: number;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    siteName: 'GECAIN Motor Shop',
    taxRate: BUSINESS_CONFIG.TAX_RATE * 100, // Convert to percentage
    shippingCost: BUSINESS_CONFIG.SHIPPING_COST,
    currency: BUSINESS_CONFIG.CURRENCY,
    freeShippingThreshold: BUSINESS_CONFIG.FREE_SHIPPING_THRESHOLD,
  });

  const [state, setState] = useState<SettingsState>({
    loading: false,
    success: false,
    error: null,
  });

  const handleChange = (field: keyof AppSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!settings.siteName.trim()) {
      setState({ loading: false, success: false, error: 'Site name is required' });
      setTimeout(() => setState(prev => ({ ...prev, error: null })), TIMING.TOAST_DURATION);
      return;
    }

    if (settings.taxRate < 0 || settings.taxRate > 100) {
      setState({ loading: false, success: false, error: 'Tax rate must be between 0 and 100' });
      setTimeout(() => setState(prev => ({ ...prev, error: null })), TIMING.TOAST_DURATION);
      return;
    }

    if (settings.shippingCost < 0) {
      setState({ loading: false, success: false, error: 'Shipping cost cannot be negative' });
      setTimeout(() => setState(prev => ({ ...prev, error: null })), TIMING.TOAST_DURATION);
      return;
    }

    setState({ loading: true, success: false, error: null });

    try {
      // TODO: Replace with actual API call to save settings to database
      // For now, simulating the API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, you would call:
      // const response = await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });

      console.log('✅ Settings saved:', settings);
      
      setState({ loading: false, success: true, error: null });
      
      // Clear success message after timeout
      setTimeout(() => {
        setState(prev => ({ ...prev, success: false }));
      }, TIMING.TOAST_DURATION);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save settings';
      setState({ loading: false, success: false, error: errorMsg });
      
      // Clear error message after timeout
      setTimeout(() => {
        setState(prev => ({ ...prev, error: null }));
      }, TIMING.TOAST_DURATION);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Settings', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Settings className="h-8 w-8" />
          System Settings
        </h1>
        <p className="opacity-90">Manage system configuration and business rules</p>
      </div>

      {/* Success Message */}
      {state.success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-green-800 dark:text-green-200 font-semibold">{SUCCESS_MESSAGES.PROFILE_UPDATED}</p>
            <p className="text-green-700 dark:text-green-300 text-sm mt-1">Your settings have been saved successfully.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {state.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-800 dark:text-red-200 font-semibold">Error</p>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">{state.error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 space-y-6">
        {/* Site Name */}
        <div>
          <label htmlFor="siteName" className="block text-sm font-semibold mb-2">Site Name</label>
          <input
            id="siteName"
            type="text"
            value={settings.siteName}
            onChange={(e) => handleChange('siteName', e.target.value)}
            disabled={state.loading}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 disabled:opacity-50"
            placeholder="Enter site name"
            required
          />
        </div>

        {/* Grid Layout for Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="taxRate" className="block text-sm font-semibold mb-2">Tax Rate (%)</label>
            <input
              id="taxRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={settings.taxRate}
              onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
              disabled={state.loading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 disabled:opacity-50"
              placeholder="0"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Applied to all orders</p>
          </div>

          <div>
            <label htmlFor="shippingCost" className="block text-sm font-semibold mb-2">Shipping Cost (₱)</label>
            <input
              id="shippingCost"
              type="number"
              min="0"
              step="0.01"
              value={settings.shippingCost}
              onChange={(e) => handleChange('shippingCost', parseFloat(e.target.value))}
              disabled={state.loading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 disabled:opacity-50"
              placeholder="0"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Default shipping fee</p>
          </div>
        </div>

        {/* Free Shipping Threshold */}
        <div>
          <label htmlFor="freeShippingThreshold" className="block text-sm font-semibold mb-2">Free Shipping Threshold (₱)</label>
          <input
            id="freeShippingThreshold"
            type="number"
            min="0"
            step="0.01"
            value={settings.freeShippingThreshold}
            onChange={(e) => handleChange('freeShippingThreshold', parseFloat(e.target.value))}
            disabled={state.loading}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 disabled:opacity-50"
            placeholder="0"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping</p>
        </div>

        {/* Currency (Read-only for now) */}
        <div>
          <label htmlFor="currency" className="block text-sm font-semibold mb-2">Currency</label>
          <input
            id="currency"
            type="text"
            value={settings.currency}
            disabled
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 opacity-50"
          />
          <p className="text-xs text-gray-500 mt-1">System currency (read-only)</p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Changes to these settings will be applied to all new orders. Existing orders will retain their original settings.
          </p>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={state.loading}
          className="w-full bg-[#FF6B4A] text-white py-3 rounded-lg hover:bg-[#E55A3A] font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {state.loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </form>
    </div>
  );
}
