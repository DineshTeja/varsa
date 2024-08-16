'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPlayground, setIsPlayground] = useState(true);

  useEffect(() => {
    setIsPlayground(pathname === '/modelplayground');
  }, [pathname]);

  const handleSwitchChange = (checked: boolean) => {
    setIsPlayground(checked);
    if (checked) {
      router.push('/modelplayground');
    } else {
      router.push('/example');
    }
  };

  return (
    <nav className="grid grid-cols-3 items-center p-4 shadow-sm rounded-lg bg-white mx-4 my-4">
      <div className="flex items-center">
        <Link href="/example" className="flex items-center">
          <h2 className="text-2xl font-thin font-serif text-green-800">varsa</h2>
        </Link>
      </div>
      <div className="flex justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="px-2 sm:px-4 py-2 bg-green-50 rounded-full text-xs sm:text-sm text-green-800 flex items-center max-w-full overflow-hidden">
                <span className="flex-shrink-0">🎉</span>
                <hr className="mx-2 h-4 w-[1px] shadow-none shrink-0 bg-gray-300 hidden sm:block" />
                <span className="font-medium flex-shrink-0 hidden sm:inline">Rollout(s):</span>
                <span className="ml-1 truncate">
                  Try prompt caching on Claude 3.5 Sonnet!
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Try prompt caching on Claude 3.5 Sonnet!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center justify-end space-x-2 p-2 rounded-lg">
        <Dialog>
          <DialogTrigger>
            <div className="bg-gray-100 hover:bg-green-700 text-green-800 hover:text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
              <Label htmlFor="playground-mode" className="text-sm font-medium cursor-pointer">
                Learn More ♡
              </Label>
              <Image src="/dineshprofile.png" alt="Varsa" width={24} height={24} className="rounded-full"/>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-green-800">Welcome to Varsa</DialogTitle>
              <DialogDescription>
                <p className="mt-2 text-sm text-gray-600">
                  Varsa is your playground for comparing LLMs across different providers. Here&apos;s how to get started:
                </p>
                <ol className="mt-4 space-y-2 text-sm text-gray-600 list-decimal list-inside">
                  <li>Enter your API keys (don&apos;t worry, we never store them)</li>
                  <li>Select the models you want to compare</li>
                  <li>(Optional) Select the benchmark you want to use</li>
                  <li>Input your prompt(s)/context and hit &quot;Run&quot;</li>
                </ol>
                <p className="mt-4 text-sm text-gray-600">
                  Compare output quality, response time, and cost across models to find the best fit for your needs.
                </p>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">About me!</h4>
                  <p className="mt-2 text-sm text-gray-600">
                    Hi, I&apos;m Dinesh, a CS student at Harvard. I built Varsa to make it easy for developers and researchers to evaluate different LLMs side by side.
                  </p>
                  <p className="mt-2 text-sm text-green-800 font-medium">
                  (It&apos;s been done before, but I wanted my own lol).
                  </p>
                </div>
                <div className="mt-6">
                  <a
                    href="https://github.com/DineshTeja/varsa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-green-800 hover:text-green-700"
                  >
                    View on GitHub
                    <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  </a>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {/* <div className="flex items-center justify-end space-x-2 p-2 rounded-lg">
        <Label htmlFor="playground-mode" className={`text-sm ${isPlayground ? "text-gray-600" : "text-green-800 font-medium"}`}>
          Example
        </Label>
        <Switch
          id="playground-mode"
          checked={isPlayground}
          onCheckedChange={handleSwitchChange}
          className="data-[state=checked]:bg-green-800"
        />
        <Label htmlFor="example-mode" className={`text-sm ${isPlayground ? "text-green-800 font-medium" : "text-gray-600"}`}>
          Playground
        </Label>
      </div> */}
    </nav>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  color?: string;
}

function NavItem({ href, icon, text, isActive, color }: NavItemProps) {
  return (
    <Link href={href} className="relative mr-4">
      <motion.div
        className={`flex items-center px-3 py-2 rounded-md ${isActive ? 'bg-gray-100' : ''} ${color}`}
        whileHover={{ backgroundColor: color ? color : 'rgba(0, 0, 0, 0.05)' }}
        animate={{ backgroundColor: isActive ? 'rgba(0, 0, 0, 0.05)' : color ? color : 'rgba(0, 0, 0, 0)' }}
      >
        {icon}
        {text}
      </motion.div>
    </Link>
  );
}