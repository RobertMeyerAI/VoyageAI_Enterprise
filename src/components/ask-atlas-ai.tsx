'use client';

import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { askAtlasAIVeganRestaurants } from '@/ai/flows/ask-atlas-ai-vegan-restaurants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import type { AiChatMessage } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Sparkles, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const quickActions = [
  'How do I get from CPH to my hotel?',
  'What’s the lounge situation in Stockholm?',
  'Any vegan restaurants open after 22:00?',
];

export function AskAtlasAI() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuickAction = (action: string) => {
    setInput(action);
    // You might want to auto-submit here, or just populate the input
    // For now, let's just populate
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: AiChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // This is a simplified logic. A real app would need a router
      // to decide which AI flow to call based on the input.
      // For this prototype, we'll hardcode one flow for demonstration.
      const result = await askAtlasAIVeganRestaurants({
        city: 'Stockholm',
        time: '22:30',
        query: input,
      });

      const assistantMessage: AiChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I found ${result.restaurants.length} vegan restaurant(s) for you:\n\n${result.restaurants
          .map(
            (r) =>
              `**${r.name}**\n*Address:* ${r.address}\n*Hours:* ${r.openingHours}\n*Distance:* ${r.distance}`
          )
          .join('\n\n')}`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI flow:', error);
      const errorMessage: AiChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not get a response from the assistant."
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex h-[calc(100vh-10rem)] flex-col md:h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="font-headline text-xl font-semibold">Ask Voyage AI</h1>
        </div>
      </CardHeader>
      <CardContent ref={scrollAreaRef} className="flex-1 space-y-6 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground">
            <Sparkles className="mx-auto h-10 w-10 mb-4" />
            <p className="font-medium">Welcome to Voyage AI</p>
            <p className="text-sm">Your context-aware travel assistant. Ask me anything about your trip.</p>
            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {quickActions.map((action) => (
                <Button key={action} variant="outline" size="sm" onClick={() => handleQuickAction(action)}>
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-start gap-3',
              message.role === 'user' && 'justify-end'
            )}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Voyage AI" asChild>
                    <Bot className='p-1.5' />
                </AvatarImage>
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-sm rounded-lg px-4 py-2 text-sm md:max-w-md lg:max-w-lg',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary',
                message.role === 'system' && 'w-full bg-destructive/20 text-center text-destructive-foreground'
              )}
            >
              <div className="prose prose-sm prose-invert"
                dangerouslySetInnerHTML={{
                  __html: message.content.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>'),
                }}
              />
            </div>
            {message.role === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="person face" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Voyage AI" asChild>
                        <Bot className='p-1.5' />
                    </AvatarImage>
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="max-w-sm rounded-lg px-4 py-3 bg-secondary">
                    <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span>Thinking...</span>
                    </div>
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your trip..."
            disabled={isLoading}
            autoComplete="off"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
