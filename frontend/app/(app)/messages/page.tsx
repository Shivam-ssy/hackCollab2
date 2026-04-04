'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Send } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';

export default function MessagesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <EmptyState
              title="No conversations"
              description="Select a user to start messaging"
            />
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Select a conversation</h2>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              title="No conversation selected"
              description="Choose a conversation to view messages"
            />
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input placeholder="Type a message..." disabled />
              <Button disabled size="icon">
                <Send size={20} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
