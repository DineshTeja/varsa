'use client';

import React from 'react';
import Navbar from '@/components/ui/navbar';
import ModelPlayground from '@/components/ModelPlayground';

export default function PlaygroundPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-start px-4 pb-8">
        <ModelPlayground />
      </div>
    </div>
  );
}