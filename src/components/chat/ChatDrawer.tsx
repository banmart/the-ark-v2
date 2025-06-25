
import React from 'react';
import { useChatContext } from '../providers/ChatProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import ChatAssistant from './ChatAssistant';

const ChatDrawer = () => {
  const { isOpen, setIsOpen } = useChatContext();
  const isMobile = useIsMobile();

  if (isMobile) {
    // Mobile: Bottom drawer using vaul
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="h-[80vh] bg-black border-t-2 border-cyan-500/30">
          <DrawerHeader className="sr-only">
            <DrawerTitle>ARK Chat Assistant</DrawerTitle>
            <DrawerDescription>AI assistant to help with ARK, bridges, and Coinbase</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-hidden">
            <ChatAssistant />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Side drawer
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-96 bg-gradient-to-b from-black via-gray-900 to-black border-l-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/10 pointer-events-auto transform transition-transform duration-300 ease-out">
        <ChatAssistant />
      </div>
    </div>
  );
};

export default ChatDrawer;
