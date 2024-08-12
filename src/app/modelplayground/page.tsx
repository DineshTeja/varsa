'use client';

import React from 'react';
import Navbar from '@/components/ui/navbar';
import ModelPlayground from '@/components/ModelPlayground';

export default function PlaygroundPage() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 pt-20">
        <h1 className="text-4xl font-thin mb-8 text-green-800 subpixel-antialiased font-serif">Model Playground</h1>
        <ModelPlayground />
      </div>
    </>
  );
}