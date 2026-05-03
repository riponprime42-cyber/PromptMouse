
"use client";

import { useState, useEffect } from 'react';

export type PlanType = 'free' | 'pro' | 'max';

interface Usage {
  image: number;
  video: number;
}

const STORAGE_KEY = 'promptmuse_subscription';
const USAGE_KEY = 'promptmuse_usage';

export const PLAN_LIMITS = {
  free: { image: 2, video: 2, label: 'Free' },
  pro: { image: 100, video: 100, label: 'Pro' },
  max: { image: Infinity, video: Infinity, label: 'Max' }
};

export function useSubscriptionStore() {
  const [plan, setPlan] = useState<PlanType>('free');
  const [usage, setUsage] = useState<Usage>({ image: 0, video: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem(STORAGE_KEY) as PlanType;
    const savedUsage = localStorage.getItem(USAGE_KEY);

    if (savedPlan) setPlan(savedPlan);
    if (savedUsage) {
      try {
        setUsage(JSON.parse(savedUsage));
      } catch (e) {
        console.error("Failed to parse usage data");
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, plan);
      localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
    }
  }, [plan, usage, isLoaded]);

  const canGenerate = (medium: 'image' | 'video') => {
    const currentLimit = PLAN_LIMITS[plan][medium];
    return usage[medium] < currentLimit;
  };

  const incrementUsage = (medium: 'image' | 'video') => {
    setUsage(prev => ({
      ...prev,
      [medium]: prev[medium] + 1
    }));
  };

  const upgradePlan = (newPlan: PlanType) => {
    setPlan(newPlan);
    // When upgrading to max or pro, we don't reset usage but the limits expand
  };

  const getRemaining = (medium: 'image' | 'video') => {
    const limit = PLAN_LIMITS[plan][medium];
    if (limit === Infinity) return 'Unlimited';
    return Math.max(0, limit - usage[medium]);
  };

  return {
    plan,
    usage,
    canGenerate,
    incrementUsage,
    upgradePlan,
    getRemaining,
    isLoaded
  };
}
