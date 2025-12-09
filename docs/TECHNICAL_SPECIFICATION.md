# TRU Talk — Technical Specification

**Version:** 1.0.0  
**Last Updated:** December 9, 2024  
**Classification:** Internal — Technical Stakeholders  
**Project ID:** `onmloxbgblyqqufgdulm`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Database Design](#6-database-design)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [API Specifications](#8-api-specifications)
9. [AI/ML Integration](#9-aiml-integration)
10. [Real-Time Communication](#10-real-time-communication)
11. [Third-Party Integrations](#11-third-party-integrations)
12. [Security Architecture](#12-security-architecture)
13. [Performance & Scalability](#13-performance--scalability)
14. [Monitoring & Observability](#14-monitoring--observability)
15. [Deployment Architecture](#15-deployment-architecture)
16. [Data Models](#16-data-models)
17. [Error Handling](#17-error-handling)
18. [Testing Strategy](#18-testing-strategy)
19. [Appendices](#19-appendices)

---

## 1. Executive Summary

### 1.1 Product Overview

TRU Talk is a voice-first social platform enabling authentic cross-cultural connections through AI-powered emotion matching and real-time translation. The platform differentiates from traditional text-based social apps by prioritizing voice as the primary medium for human connection.

### 1.2 Core Value Propositions

| Feature | Technical Implementation |
|---------|-------------------------|
| **Emotion AI Matching** | OpenAI embeddings + cosine similarity on 8-dimension emotion vectors |
| **Real-Time Translation** | Google Cloud Speech-to-Text + DeepL API + Text-to-Speech synthesis |
| **Voice-First Experience** | 60-second ephemeral voice clips with automatic transcription |
| **Gamification** | Streak tracking, daily drops, echo chips virtual currency |
| **Privacy-First** | Automatic 60-second audio deletion, end-to-end encryption |

### 1.3 Target Metrics

| Metric | Target | Technical Implication |
|--------|--------|----------------------|
| DAU/MAU | >40% | Low-latency matching, push notification optimization |
| Match-to-Call Rate | >60% | Sub-3s match algorithm execution |
| Session Duration | >12 min | WebRTC call quality optimization |
| Churn Rate | <5% monthly | Streak mechanics, engagement hooks |

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │   React Web     │    │  React Native   │    │   Progressive   │          │
│  │   (Vite/SWC)    │    │    (Expo)       │    │    Web App      │          │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘          │
└───────────┼──────────────────────┼──────────────────────┼───────────────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Supabase Edge Functions (Deno)                    │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │ auth     │ │ match    │ │ call     │ │ transcr. │ │ payment  │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────┬─────────────────────────────────────┘
                                        │
            ┌───────────────────────────┼───────────────────────────┐
            ▼                           ▼                           ▼
┌───────────────────┐      ┌───────────────────────┐    ┌───────────────────┐
│    DATA LAYER     │      │     AI SERVICES       │    │  EXTERNAL APIS    │
├───────────────────┤      ├───────────────────────┤    ├───────────────────┤
│ ┌───────────────┐ │      │ ┌───────────────────┐ │    │ ┌───────────────┐ │
│ │ PostgreSQL 15 │ │      │ │ OpenAI GPT-4      │ │    │ │ Stripe        │ │
│ │ (Supabase)    │ │      │ │ Embeddings API    │ │    │ │ Payments      │ │
│ └───────────────┘ │      │ └───────────────────┘ │    │ └───────────────┘ │
│ ┌───────────────┐ │      │ ┌───────────────────┐ │    │ ┌───────────────┐ │
│ │ Supabase      │ │      │ │ Google Cloud      │ │    │ │ Twilio        │ │
│ │ Storage       │ │      │ │ Speech/Translate  │ │    │ │ SMS/Voice     │ │
│ └───────────────┘ │      │ └───────────────────┘ │    │ └───────────────┘ │
│ ┌───────────────┐ │      │ ┌───────────────────┐ │    │ ┌───────────────┐ │
│ │ Supabase      │ │      │ │ DeepL             │ │    │ │ Daily.co      │ │
│ │ Realtime      │ │      │ │ Translation       │ │    │ │ Video Rooms   │ │
│ └───────────────┘ │      │ └───────────────────┘ │    │ └───────────────┘ │
└───────────────────┘      └───────────────────────┘    └───────────────────┘
```

### 2.2 Request Flow Architecture

```
User Action → Client App → Supabase Client SDK → Edge Function → Business Logic
                                                       ↓
                                              External API (if needed)
                                                       ↓
                                              Database Operation
                                                       ↓
                                              Response → Client
```

### 2.3 Monorepo Structure

```
trutalk/
├── apps/
│   ├── web/                    # Next.js web application
│   │   ├── src/
│   │   └── next.config.js
│   └── mobile/                 # React Native (Expo) mobile app
│       ├── src/
│       └── metro.config.js
├── packages/
│   ├── shared/                 # Shared types, validators, utilities
│   │   ├── src/
│   │   │   ├── types.ts       # Core TypeScript interfaces
│   │   │   ├── validators.ts  # Zod validation schemas
│   │   │   └── utils.ts       # Shared utility functions
│   │   └── package.json
│   ├── ai/                     # AI integration modules
│   │   ├── src/
│   │   │   ├── deepl.ts
│   │   │   ├── google-cloud.ts
│   │   │   └── translation-orchestrator.ts
│   │   └── package.json
│   └── backend/                # Serverless API functions
│       ├── api/
│       │   ├── call-webhook.ts
│       │   ├── cleanup.ts
│       │   ├── daily-drop.ts
│       │   ├── find-match.ts
│       │   ├── start-call.ts
│       │   ├── stripe-webhook.ts
│       │   ├── transcribe.ts
│       │   ├── vectorize.ts
│       │   └── verify-phone.ts
│       └── src/lib/
│           ├── daily.ts
│           ├── openai.ts
│           ├── stripe.ts
│           ├── supabase.ts
│           └── twilio.ts
├── supabase/
│   ├── config.toml             # Supabase project configuration
│   ├── functions/              # Edge functions (Deno runtime)
│   └── migrations/             # SQL migration files
├── src/                        # Lovable/Vite frontend source
│   ├── components/
│   ├── hooks/
│   ├── integrations/
│   ├── lib/
│   └── pages/
├── scripts/                    # Deployment & utility scripts
├── docs/                       # Documentation
└── deliverables/               # Production artifacts & patches
```

---

## 3. Technology Stack

### 3.1 Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI library with concurrent features |
| **Vite** | 5.4.21 | Build tool with HMR, SWC transpilation |
| **TypeScript** | 5.x | Type safety and developer experience |
| **Tailwind CSS** | 3.4.18 | Utility-first CSS framework |
| **React Router** | 6.30.2 | Client-side routing |
| **TanStack Query** | 5.90.10 | Server state management, caching |
| **Radix UI** | Latest | Accessible component primitives |
| **Lucide React** | 0.554.0 | Icon library |
| **class-variance-authority** | 0.7.1 | Component variant management |

### 3.2 Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | 2.83.0 | Backend-as-a-Service (PostgreSQL, Auth, Storage, Realtime) |
| **Deno** | Latest | Edge function runtime |
| **PostgreSQL** | 15.x | Primary database |
| **Vercel** | Latest | Serverless function hosting (Node.js runtime) |

### 3.3 AI/ML Stack

| Service | Provider | Purpose |
|---------|----------|---------|
| **Speech-to-Text** | Google Cloud | Voice transcription with language detection |
| **Text-to-Speech** | Google Cloud | Voice synthesis for translations |
| **Translation** | Google Cloud + DeepL | High-accuracy text translation |
| **Embeddings** | OpenAI | Emotion vector generation |
| **Lovable AI Gateway** | Lovable | Unified AI access (Gemini, GPT-5) |

### 3.4 Third-Party Services

| Service | Purpose | Integration Pattern |
|---------|---------|-------------------|
| **Stripe** | Payments, subscriptions | Webhook-based |
| **Twilio** | SMS verification, phone calls | REST API |
| **Daily.co** | WebRTC video/audio rooms | REST + WebSocket |
| **Solana** | NFT minting (future) | RPC client |

### 3.5 Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Jest** | Unit testing |
| **Turbo** | Monorepo build system |
| **lovable-tagger** | Component debugging |

---

## 4. Frontend Architecture

### 4.1 Application Structure

```typescript
// src/main.tsx - Application entry point
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,        // 10 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

### 4.2 Routing Configuration

| Route | Component | Auth Required | Description |
|-------|-----------|---------------|-------------|
| `/` | `Landing` | No | Marketing landing page |
| `/auth` | `Auth` | No | Login/signup flow |
| `/match` | `Match` | Yes | Voice matching interface |
| `/call/:id` | `Call` | Yes | Active call interface |
| `/profile` | `Profile` | Yes | User profile management |

### 4.3 Design System

#### 4.3.1 Color Tokens (HSL-based)

```css
/* src/index.css - Design tokens */
:root {
  /* Base colors */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  
  /* Card surfaces */
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  
  /* Primary brand */
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  
  /* Secondary UI */
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  
  /* Muted surfaces */
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  
  /* Accent (success) */
  --accent: 142.1 76.2% 36.3%;
  --accent-foreground: 222.2 47.4% 11.2%;
  
  /* Destructive (error) */
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  
  /* Borders & inputs */
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
  
  /* Border radius */
  --radius: 0.5rem;
}
```

#### 4.3.2 Component Library

Based on shadcn/ui with Radix primitives:

| Component | Source | Customization |
|-----------|--------|---------------|
| Button | `src/components/ui/button.tsx` | CVA variants |
| Card | `src/components/ui/card.tsx` | Background blur |
| Input | `src/components/ui/input.tsx` | Dark mode styling |
| Toast | `src/components/ui/toast.tsx` | Notification system |

### 4.4 State Management

```typescript
// Pattern: Custom hooks with Supabase + TanStack Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}
```

### 4.5 Error Boundary Implementation

```typescript
// src/lib/error-boundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Send to monitoring service
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorUI error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

---

## 5. Backend Architecture

### 5.1 Supabase Edge Functions

Edge functions run on Deno and are deployed to Supabase's global edge network.

#### 5.1.1 Function Configuration

```toml
# supabase/config.toml
project_id = "trutalk-unicorn"

[api]
enabled = true
port = 54321
schemas = ["public", "storage", "graphql_public"]
max_rows = 1000

[db]
port = 54322
major_version = 15

[db.pooler]
enabled = false
pool_mode = "transaction"
default_pool_size = 20
max_client_conn = 100

[realtime]
enabled = true

[storage]
enabled = true
file_size_limit = "50MiB"

[auth]
enabled = true
jwt_expiry = 3600
enable_signup = true

[auth.email]
enable_signup = true
double_confirm_changes = true

[auth.sms]
enable_signup = true
enable_confirmations = true
template = "Your TRU Talk code is {{ .Code }}"
```

#### 5.1.2 Edge Function Template

```typescript
// supabase/functions/example/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await req.json();
    
    // Business logic here
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
```

### 5.2 Vercel Serverless Functions (Node.js)

For compute-intensive operations requiring Node.js runtime:

```typescript
// packages/backend/api/transcribe.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SpeechClient } from '@google-cloud/speech';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { audioUrl, languageCode } = req.body;
    
    const client = new SpeechClient();
    const [response] = await client.recognize({
      audio: { uri: audioUrl },
      config: {
        encoding: 'LINEAR16',
        languageCode: languageCode || 'en-US',
        enableAutomaticPunctuation: true,
      },
    });

    return res.status(200).json({
      transcription: response.results?.[0]?.alternatives?.[0]?.transcript,
      confidence: response.results?.[0]?.alternatives?.[0]?.confidence,
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({ error: 'Transcription failed' });
  }
}
```

### 5.3 API Client with Retry Logic

```typescript
// src/lib/api-client.ts
import { supabase } from '@/integrations/supabase/client';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | null = null;
  let delay = opts.initialDelay;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on client errors (4xx)
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as any).status;
        if (status >= 400 && status < 500) {
          throw error;
        }
      }

      if (attempt < opts.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay);
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

export async function invokeEdgeFunction<T = any>(
  functionName: string,
  body?: Record<string, any>,
  options: RetryOptions = {}
): Promise<T> {
  return withRetry(async () => {
    const { data, error } = await supabase.functions.invoke<T>(functionName, {
      body,
    });

    if (error) {
      throw new Error(`Edge function ${functionName} failed: ${error.message}`);
    }

    return data as T;
  }, options);
}
```

---

## 6. Database Design

### 6.1 Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   profiles   │     │    matches   │     │ call_history │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │◄───┐│ id (PK)      │     │ id (PK)      │
│ display_name │    ││ user_id      │────►│ caller_id    │
│ age          │    ││ matched_user │     │ receiver_id  │
│ gender       │    ││ match_score  │     │ duration     │
│ tagline      │    ││ status       │     │ translation  │
│ interests[]  │    ││ created_at   │     │ languages    │
│ voice_clip   │    │└──────────────┘     │ created_at   │
│ github_user  │    │                     └──────────────┘
│ created_at   │    │
│ updated_at   │    │     ┌──────────────┐
└──────────────┘    │     │ voice_clips  │
                    │     ├──────────────┤
┌──────────────┐    │     │ id (PK)      │
│  user_roles  │    │     │ user_id      │────┐
├──────────────┤    │     │ file_path    │    │
│ id (PK)      │    │     │ duration     │    │
│ user_id      │────┘     │ emotion_vec  │    │
│ role (enum)  │          │ created_at   │    │
│ created_at   │          └──────────────┘    │
└──────────────┘                              │
                                              │
┌──────────────┐     ┌──────────────┐         │
│   streaks    │     │  challenges  │         │
├──────────────┤     ├──────────────┤         │
│ id (PK)      │     │ id (PK)      │         │
│ user_id      │─────┤ title        │         │
│ current      │     │ description  │         │
│ longest      │     │ prompt       │         │
│ last_active  │     │ reward_pts   │         │
│ insurance    │     │ active       │         │
└──────────────┘     │ created_at   │         │
                     └──────────────┘         │
                            │                 │
                     ┌──────────────┐         │
                     │user_challenges│        │
                     ├──────────────┤         │
                     │ id (PK)      │         │
                     │ user_id      │─────────┘
                     │ challenge_id │
                     │ completed    │
                     │ submission   │
                     └──────────────┘

┌──────────────┐
│community_posts│
├──────────────┤
│ id (PK)      │
│ user_id      │
│ title        │
│ content      │
│ post_type    │
│ likes        │
│ created_at   │
│ updated_at   │
└──────────────┘
```

### 6.2 Table Schemas

#### 6.2.1 Core Tables

```sql
-- profiles: User profile data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  age INTEGER CHECK (age >= 13 AND age <= 120),
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'other')),
  tagline TEXT,
  voice_clip_url TEXT,
  github_username TEXT,
  interests TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- matches: Matched user pairs
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  matched_user_id UUID NOT NULL,
  match_score FLOAT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- call_history: Completed calls
CREATE TABLE public.call_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  duration INTEGER,
  translation_used BOOLEAN DEFAULT false,
  languages JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- voice_clips: User voice recordings
CREATE TABLE public.voice_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  duration INTEGER,
  emotion_vector JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- streaks: User engagement tracking
CREATE TABLE public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  streak_insurance BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- user_roles: Role-based access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role app_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enum for roles
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');
```

#### 6.2.2 Gamification Tables

```sql
-- challenges: Weekly/daily challenges
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prompt TEXT,
  reward_points INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- user_challenges: Challenge participation
CREATE TABLE public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES challenges(id),
  completed BOOLEAN DEFAULT false,
  submission_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- community_posts: Forum posts
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'discussion',
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 6.3 Database Functions & Triggers

```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile and related records on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  INSERT INTO public.streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Role check function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;
```

### 6.4 Indexes

```sql
-- Performance indexes
CREATE INDEX idx_matches_user_id ON matches(user_id);
CREATE INDEX idx_matches_matched_user_id ON matches(matched_user_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_call_history_caller ON call_history(caller_id);
CREATE INDEX idx_call_history_receiver ON call_history(receiver_id);
CREATE INDEX idx_voice_clips_user_id ON voice_clips(user_id);
CREATE INDEX idx_streaks_user_id ON streaks(user_id);
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_user_challenges_user_id ON user_challenges(user_id);
```

---

## 7. Authentication & Authorization

### 7.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  User   │───►│ Auth Page   │───►│ Supabase    │───►│ Email/SMS   │
│         │    │ (React)     │    │ Auth        │    │ Provider    │
└─────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                     │                   │                   │
                     │                   ▼                   │
                     │           ┌─────────────┐             │
                     │           │ JWT Token   │◄────────────┘
                     │           │ Generated   │
                     │           └─────────────┘
                     │                   │
                     ▼                   ▼
              ┌─────────────┐    ┌─────────────┐
              │ Session     │◄───│ Auth State  │
              │ Storage     │    │ Listener    │
              └─────────────┘    └─────────────┘
```

### 7.2 Auth Hook Implementation

```typescript
// src/hooks/use-auth.ts
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle auth events
        if (event === 'SIGNED_OUT') {
          toast({ title: 'Signed out', description: 'You have been signed out.' });
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Session refreshed successfully');
        } else if (event === 'SIGNED_IN') {
          toast({ title: 'Welcome back!', description: 'Signed in successfully.' });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
      return { error };
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: displayName },
      },
    });
    if (error) {
      toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
      return { error };
    }
    toast({ title: 'Check your email', description: 'Confirmation link sent.' });
    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: 'Sign out failed', description: error.message, variant: 'destructive' });
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };
}
```

### 7.3 Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, owner write
CREATE POLICY "Profiles viewable by authenticated users"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Matches: Participants can view/update
CREATE POLICY "Users can view own matches"
  ON matches FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

CREATE POLICY "Users can create matches"
  ON matches FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own matches"
  ON matches FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

-- Voice clips: Owner only
CREATE POLICY "Users can view own voice clips"
  ON voice_clips FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own voice clips"
  ON voice_clips FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own voice clips"
  ON voice_clips FOR DELETE USING (auth.uid() = user_id);

-- User roles: Admin management
CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON user_roles FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Challenges: Public read, admin write
CREATE POLICY "Authenticated users can view challenges"
  ON challenges FOR SELECT USING (true);

CREATE POLICY "Admins can manage challenges"
  ON challenges FOR ALL USING (has_role(auth.uid(), 'admin'));
```

### 7.4 JWT Configuration

| Parameter | Value | Notes |
|-----------|-------|-------|
| Algorithm | HS256 | HMAC SHA-256 |
| Expiry | 3600s (1 hour) | Auto-refresh enabled |
| Claims | `sub`, `email`, `role`, `aud` | Standard Supabase claims |

---

## 8. API Specifications

### 8.1 API Endpoints

#### 8.1.1 Authentication APIs

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/v1/signup` | POST | None | User registration |
| `/auth/v1/token` | POST | None | Email/password login |
| `/auth/v1/logout` | POST | JWT | Session termination |
| `/auth/v1/recover` | POST | None | Password recovery |

#### 8.1.2 Edge Function APIs

| Function | Method | Auth | Input | Output |
|----------|--------|------|-------|--------|
| `verify-phone` | POST | None | `{ phone, code? }` | `{ success, userId?, token? }` |
| `transcribe` | POST | JWT | `{ clipId, audioUrl }` | `{ transcription, language, confidence }` |
| `vectorize` | POST | JWT | `{ clipId, transcription }` | `{ emotionVector, emotionLabels }` |
| `find-match` | POST | JWT | `{ userId, clipId }` | `{ match, similarityScore }` |
| `start-call` | POST | JWT | `{ matchId, userId }` | `{ call, roomUrl }` |
| `call-webhook` | POST | API Key | Daily.co webhook payload | `{ acknowledged }` |
| `stripe-webhook` | POST | Signature | Stripe webhook payload | `{ received }` |
| `daily-drop` | POST | Cron | None | `{ usersUpdated, chipsDistributed }` |
| `cleanup` | POST | Cron | None | `{ deletedClips, deletedMatches }` |

### 8.2 Request/Response Schemas

```typescript
// packages/shared/src/types.ts

// Phone Verification
interface VerifyPhoneRequest {
  phone_number: string;
  verification_code?: string;
}

interface VerifyPhoneResponse {
  success: boolean;
  user_id?: string;
  token?: string;
  message?: string;
}

// Transcription
interface TranscribeRequest {
  voice_clip_id: string;
  audio_url: string;
}

interface TranscribeResponse {
  success: boolean;
  transcription?: string;
  language_detected?: string;
  confidence_score?: number;
  error?: string;
}

// Vectorization (Emotion Analysis)
interface VectorizeRequest {
  voice_clip_id: string;
  transcription: string;
}

interface VectorizeResponse {
  success: boolean;
  emotion_vector?: number[];  // 8-dimensional
  emotion_labels?: EmotionLabels;
  error?: string;
}

interface EmotionLabels {
  lonely?: number;
  happy?: number;
  excited?: number;
  sad?: number;
  anxious?: number;
  calm?: number;
  romantic?: number;
  playful?: number;
}

// Matching
interface FindMatchRequest {
  user_id: string;
  voice_clip_id: string;
}

interface FindMatchResponse {
  success: boolean;
  match?: Match;
  error?: string;
}

// Call Initiation
interface StartCallRequest {
  match_id: string;
  user_id: string;
}

interface StartCallResponse {
  success: boolean;
  call?: Call;
  room_url?: string;
  error?: string;
}
```

### 8.3 Error Response Format

```typescript
interface APIError {
  error: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

// Standard error codes
const ERROR_CODES = {
  VALIDATION_ERROR: 'E001',
  AUTHENTICATION_REQUIRED: 'E002',
  FORBIDDEN: 'E003',
  NOT_FOUND: 'E004',
  RATE_LIMITED: 'E005',
  INTERNAL_ERROR: 'E500',
} as const;
```

---

## 9. AI/ML Integration

### 9.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AI PROCESSING PIPELINE                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Voice  │───►│ Google Cloud│───►│   OpenAI    │───►│  Emotion    │
│  Clip   │    │ Speech-to-  │    │ Embeddings  │    │  Vector     │
│         │    │ Text        │    │ API         │    │  (8-dim)    │
└─────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                     │                                      │
                     ▼                                      ▼
              ┌─────────────┐                        ┌─────────────┐
              │ Language    │                        │ Cosine      │
              │ Detection   │                        │ Similarity  │
              └─────────────┘                        │ Matching    │
                     │                               └─────────────┘
                     ▼                                      │
              ┌─────────────┐                               ▼
              │ Real-time   │                        ┌─────────────┐
              │ Translation │                        │ Match       │
              │ (DeepL)     │                        │ Results     │
              └─────────────┘                        └─────────────┘
```

### 9.2 Emotion Vector Model

```typescript
// 8-dimensional emotion embedding
interface EmotionVector {
  dimensions: [
    lonely: number,   // -1 to 1
    happy: number,
    excited: number,
    sad: number,
    anxious: number,
    calm: number,
    romantic: number,
    playful: number,
  ];
}

// Matching algorithm
function calculateSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, a, i) => sum + a * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, a) => sum + a * a, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, a) => sum + a * a, 0));
  return dotProduct / (magnitude1 * magnitude2); // Cosine similarity
}
```

### 9.3 Translation Orchestrator

```typescript
// packages/ai/src/translation-orchestrator.ts

interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  priority: 'speed' | 'quality';
}

interface TranslationResult {
  translatedText: string;
  provider: 'google' | 'deepl';
  confidence: number;
  latencyMs: number;
}

class TranslationOrchestrator {
  private googleClient: TranslateClient;
  private deeplClient: Translator;

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const startTime = Date.now();
    
    // DeepL for European languages (higher quality)
    if (this.isDeepLSupported(request.sourceLang, request.targetLang)) {
      const result = await this.deeplClient.translateText(
        request.text,
        request.sourceLang,
        request.targetLang
      );
      return {
        translatedText: result.text,
        provider: 'deepl',
        confidence: 0.95,
        latencyMs: Date.now() - startTime,
      };
    }
    
    // Google for all other languages
    const [translation] = await this.googleClient.translate(request.text, {
      from: request.sourceLang,
      to: request.targetLang,
    });
    
    return {
      translatedText: translation,
      provider: 'google',
      confidence: 0.85,
      latencyMs: Date.now() - startTime,
    };
  }
}
```

### 9.4 Lovable AI Gateway Integration

```typescript
// Edge function calling Lovable AI
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-2.5-flash",  // Default model
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage },
    ],
    stream: true,
  }),
});
```

---

## 10. Real-Time Communication

### 10.1 WebRTC Architecture (Daily.co)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     WEBRTC CALL ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────┐                                    ┌─────────────┐
│   User A    │                                    │   User B    │
│   Browser   │                                    │   Browser   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  WebSocket                              WebSocket│
       ▼                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DAILY.CO SFU SERVERS                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Signaling  │    │   Media     │    │  Recording  │         │
│  │   Server    │    │   Router    │    │   (opt)     │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
       │                                                  │
       │  Webhooks                              Webhooks  │
       ▼                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE EDGE FUNCTIONS                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ start-call  │    │call-webhook │    │  cleanup    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 Daily.co Integration

```typescript
// packages/backend/src/lib/daily.ts

interface DailyRoom {
  id: string;
  name: string;
  url: string;
  created_at: string;
  config: {
    max_participants: number;
    enable_recording: boolean;
    enable_prejoin_ui: boolean;
  };
}

class DailyClient {
  private apiKey: string;
  private baseUrl = 'https://api.daily.co/v1';

  async createRoom(options?: Partial<DailyRoom['config']>): Promise<DailyRoom> {
    const response = await fetch(`${this.baseUrl}/rooms`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          max_participants: 2,
          enable_recording: false,
          exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
          ...options,
        },
      }),
    });
    
    return response.json();
  }

  async deleteRoom(roomName: string): Promise<void> {
    await fetch(`${this.baseUrl}/rooms/${roomName}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
  }
}
```

### 10.3 Supabase Realtime

```typescript
// Real-time subscriptions for match updates
const subscription = supabase
  .channel('matches')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'matches',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Match updated:', payload.new);
      // Handle match status change
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

---

## 11. Third-Party Integrations

### 11.1 Integration Summary

| Service | Purpose | Auth Method | Webhook Support |
|---------|---------|-------------|-----------------|
| Stripe | Payments | API Key + Signature | Yes |
| Twilio | SMS/Phone | Account SID + Token | Yes |
| Daily.co | WebRTC | API Key | Yes |
| Google Cloud | AI Services | Service Account | No |
| DeepL | Translation | API Key | No |
| OpenAI | Embeddings | API Key | No |

### 11.2 Stripe Integration

```typescript
// packages/backend/src/lib/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Product configuration
const PRODUCTS = {
  echo_chips_50: 'price_xxx',
  echo_chips_150: 'price_xxx',
  echo_chips_500: 'price_xxx',
  premium_monthly: 'price_xxx',
  premium_yearly: 'price_xxx',
  vip_monthly: 'price_xxx',
  vip_yearly: 'price_xxx',
};

// Webhook handling
async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
  }
}
```

### 11.3 Twilio Integration

```typescript
// packages/backend/src/lib/twilio.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendVerificationCode(phoneNumber: string): Promise<string> {
  const verification = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
    .verifications.create({
      to: phoneNumber,
      channel: 'sms',
    });
  
  return verification.sid;
}

async function verifyCode(phoneNumber: string, code: string): Promise<boolean> {
  const check = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
    .verificationChecks.create({
      to: phoneNumber,
      code,
    });
  
  return check.status === 'approved';
}
```

---

## 12. Security Architecture

### 12.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                       SECURITY ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ LAYER 1: TRANSPORT SECURITY                                       │
│ • TLS 1.3 encryption for all traffic                             │
│ • HSTS headers enforced                                          │
│ • Certificate pinning (mobile)                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 2: AUTHENTICATION                                          │
│ • JWT tokens with 1-hour expiry                                  │
│ • Automatic token refresh                                        │
│ • Phone/email verification required                              │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 3: AUTHORIZATION                                           │
│ • Row Level Security (RLS) on all tables                         │
│ • Role-based access control (RBAC)                               │
│ • Function-level permissions                                     │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 4: DATA PROTECTION                                         │
│ • AES-256 encryption at rest                                     │
│ • Automatic audio file deletion (60 seconds)                     │
│ • PII anonymization in logs                                      │
└──────────────────────────────────────────────────────────────────┘
```

### 12.2 Input Validation

```typescript
// packages/shared/src/validators.ts
import { z } from 'zod';

export const phoneNumberSchema = z.string()
  .regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format');

export const displayNameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[\p{L}\p{N}\s'-]+$/u, 'Invalid characters in name');

export const profileUpdateSchema = z.object({
  display_name: displayNameSchema.optional(),
  age: z.number().min(13).max(120).optional(),
  gender: z.enum(['male', 'female', 'non-binary', 'other']).optional(),
  tagline: z.string().max(200).optional(),
  interests: z.array(z.string().max(50)).max(10).optional(),
});

export const voiceClipSchema = z.object({
  duration: z.number().min(1).max(60),
  mimeType: z.enum(['audio/webm', 'audio/wav', 'audio/mp4']),
  sizeBytes: z.number().max(10 * 1024 * 1024), // 10MB max
});
```

### 12.3 Rate Limiting

| Endpoint Category | Rate Limit | Window |
|-------------------|------------|--------|
| Authentication | 5 requests | 1 minute |
| Voice upload | 10 requests | 5 minutes |
| Match requests | 20 requests | 1 minute |
| API calls (general) | 100 requests | 1 minute |

### 12.4 Secrets Management

```toml
# Required Supabase Secrets
SUPABASE_URL=<auto-configured>
SUPABASE_ANON_KEY=<auto-configured>
SUPABASE_SERVICE_ROLE_KEY=<auto-configured>
SUPABASE_DB_URL=<auto-configured>

# External Service Keys
LOVABLE_API_KEY=<auto-provisioned>
STRIPE_SECRET_KEY=<user-provided>
TWILIO_ACCOUNT_SID=<user-provided>
TWILIO_AUTH_TOKEN=<user-provided>
TWILIO_VERIFY_SERVICE_SID=<user-provided>
DAILY_API_KEY=<user-provided>
GOOGLE_CLOUD_CREDENTIALS=<user-provided>
DEEPL_API_KEY=<user-provided>
OPENAI_API_KEY=<user-provided>
```

---

## 13. Performance & Scalability

### 13.1 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Time to First Byte (TTFB) | <200ms | TBD |
| First Contentful Paint (FCP) | <1.5s | TBD |
| Largest Contentful Paint (LCP) | <2.5s | TBD |
| Cumulative Layout Shift (CLS) | <0.1 | TBD |
| API Response Time (p95) | <500ms | TBD |
| Database Query Time (p95) | <100ms | TBD |

### 13.2 Optimization Strategies

#### 13.2.1 Frontend Optimizations

```typescript
// Code splitting with React.lazy
const Match = lazy(() => import('./pages/Match'));
const Profile = lazy(() => import('./pages/Profile'));

// TanStack Query caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,        // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

#### 13.2.2 Database Optimizations

```sql
-- Connection pooling configuration
[db.pooler]
enabled = true
pool_mode = "transaction"
default_pool_size = 20
max_client_conn = 100

-- Query optimization indexes
CREATE INDEX CONCURRENTLY idx_matches_composite 
  ON matches(user_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY idx_voice_clips_user_created 
  ON voice_clips(user_id, created_at DESC);
```

#### 13.2.3 Caching Strategy

```typescript
// Edge function caching headers
return new Response(data, {
  headers: {
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    'CDN-Cache-Control': 'max-age=3600',
  },
});
```

### 13.3 Scalability Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    HORIZONTAL SCALING ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────────────┘

              ┌─────────────────────────────────────┐
              │        CLOUDFLARE CDN               │
              │   (Global Edge Network)             │
              └───────────────┬─────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌──────────┐    ┌──────────┐    ┌──────────┐
       │ Edge     │    │ Edge     │    │ Edge     │
       │ Location │    │ Location │    │ Location │
       │ (US)     │    │ (EU)     │    │ (APAC)   │
       └────┬─────┘    └────┬─────┘    └────┬─────┘
            │               │               │
            └───────────────┼───────────────┘
                            ▼
              ┌─────────────────────────────────────┐
              │     SUPABASE INFRASTRUCTURE         │
              ├─────────────────────────────────────┤
              │  ┌─────────┐  ┌─────────────────┐  │
              │  │ Edge    │  │ PostgreSQL      │  │
              │  │Functions│  │ (Read Replicas) │  │
              │  └─────────┘  └─────────────────┘  │
              └─────────────────────────────────────┘
```

---

## 14. Monitoring & Observability

### 14.1 Logging Strategy

```typescript
// Structured logging format
interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  service: string;
  traceId: string;
  userId?: string;
  message: string;
  metadata?: Record<string, any>;
}

// Example log output
{
  "timestamp": "2024-12-09T10:30:00.000Z",
  "level": "info",
  "service": "find-match",
  "traceId": "abc123",
  "userId": "user-456",
  "message": "Match found successfully",
  "metadata": {
    "matchId": "match-789",
    "similarityScore": 0.87,
    "latencyMs": 234
  }
}
```

### 14.2 Metrics Collection

| Metric | Type | Description |
|--------|------|-------------|
| `api_requests_total` | Counter | Total API requests by endpoint |
| `api_latency_seconds` | Histogram | Request latency distribution |
| `active_calls` | Gauge | Current active voice calls |
| `matches_created_total` | Counter | Matches created over time |
| `voice_clips_processed` | Counter | Voice clips transcribed |
| `translation_requests` | Counter | Translation API calls |
| `auth_events` | Counter | Login/signup events |
| `errors_total` | Counter | Errors by type and endpoint |

### 14.3 Health Checks

```typescript
// src/lib/api-client.ts
export async function checkHealth(): Promise<boolean> {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1).single();
    return !error || error.code === 'PGRST116'; // PGRST116 = no rows (acceptable)
  } catch {
    return false;
  }
}

// Edge function health endpoint
serve(async (req) => {
  if (req.url.endsWith('/health')) {
    return new Response(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }), { status: 200 });
  }
  // ... rest of function
});
```

### 14.4 Alerting Rules

| Alert | Condition | Severity |
|-------|-----------|----------|
| High Error Rate | >5% errors in 5 minutes | Critical |
| API Latency | p95 > 2s for 5 minutes | Warning |
| Database Connection Pool | >80% utilization | Warning |
| Failed Auth Attempts | >100 failures/minute | Critical |
| Edge Function Errors | Any 5xx errors | Warning |

---

## 15. Deployment Architecture

### 15.1 Environments

| Environment | Purpose | URL Pattern |
|-------------|---------|-------------|
| Development | Local development | `localhost:8080` |
| Staging | Pre-production testing | `staging.trutalk.app` |
| Production | Live application | `trutalk.app` |

### 15.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        run: npx vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Supabase Functions
        run: npx supabase functions deploy
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

### 15.3 Deployment Scripts

```bash
# scripts/deploy-production.sh
#!/bin/bash
set -e

echo "🚀 Deploying to production..."

# Run migrations
supabase db push --linked

# Deploy edge functions
supabase functions deploy --no-verify-jwt

# Deploy frontend
vercel --prod

echo "✅ Production deployment complete!"
```

---

## 16. Data Models

### 16.1 Core Entity Types

```typescript
// packages/shared/src/types.ts

export interface User {
  id: string;
  phone_number: string;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
  display_name?: string;
  bio?: string;
  age?: number;
  gender?: 'male' | 'female' | 'non-binary' | 'other';
  preferred_languages: string[];
  notification_enabled: boolean;
  translation_enabled: boolean;
  auto_detect_language: boolean;
  streak_count: number;
  last_call_date?: string;
  total_calls: number;
  total_minutes: number;
  echo_chips: number;
  subscription_tier: 'free' | 'premium' | 'vip';
  subscription_expires_at?: string;
  last_active_at: string;
  fcm_token?: string;
  device_info?: Record<string, any>;
}

export interface VoiceClip {
  id: string;
  user_id: string;
  created_at: string;
  expires_at: string;
  storage_path: string;
  duration_seconds: number;
  file_size_bytes: number;
  transcription?: string;
  language_detected?: string;
  confidence_score?: number;
  emotion_vector?: number[];
  emotion_labels?: EmotionLabels;
  processing_status: 'pending' | 'processing' | 'completed' | 'error';
  error_message?: string;
}

export interface Match {
  id: string;
  created_at: string;
  user_id_1: string;
  user_id_2: string;
  similarity_score: number;
  voice_clip_id_1?: string;
  voice_clip_id_2?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expires_at: string;
}

export interface Call {
  id: string;
  created_at: string;
  started_at?: string;
  ended_at?: string;
  match_id: string;
  user_id_1: string;
  user_id_2: string;
  daily_room_name?: string;
  daily_room_url?: string;
  duration_seconds?: number;
  translation_enabled: boolean;
  language_user_1?: string;
  language_user_2?: string;
  translation_segments?: TranslationSegment[];
  connection_quality?: ConnectionQuality;
  echo_summary?: string;
  status: 'initiated' | 'active' | 'completed' | 'failed';
}
```

### 16.2 Constants

```typescript
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  // ... 50+ languages supported
] as const;

export const EMOTION_CATEGORIES = [
  'lonely', 'happy', 'excited', 'sad',
  'anxious', 'calm', 'romantic', 'playful',
] as const;

export const ECHO_CHIP_PRICES = {
  small: { chips: 50, price: 0.99 },
  medium: { chips: 150, price: 2.49 },
  large: { chips: 500, price: 6.99 },
  mega: { chips: 1500, price: 17.99 },
} as const;

export const SUBSCRIPTION_PRICES = {
  premium: { monthly: 9.99, yearly: 79.99 },
  vip: { monthly: 19.99, yearly: 159.99 },
} as const;
```

---

## 17. Error Handling

### 17.1 Error Hierarchy

```typescript
// Base error class
export class TruTalkError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'TruTalkError';
  }
}

// Specific error types
export class ValidationError extends TruTalkError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class AuthenticationError extends TruTalkError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_REQUIRED', 401);
  }
}

export class AuthorizationError extends TruTalkError {
  constructor(message: string = 'Access denied') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class NotFoundError extends TruTalkError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}

export class RateLimitError extends TruTalkError {
  constructor() {
    super('Too many requests', 'RATE_LIMITED', 429);
  }
}
```

### 17.2 Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, any>;
  };
  requestId: string;
  timestamp: string;
}

// Example error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Phone number format is invalid",
    "field": "phone_number"
  },
  "requestId": "req_abc123",
  "timestamp": "2024-12-09T10:30:00.000Z"
}
```

---

## 18. Testing Strategy

### 18.1 Test Pyramid

```
                    ┌─────────────────┐
                    │   E2E Tests     │  ← 10%
                    │   (Playwright)  │
                 ┌──┴─────────────────┴──┐
                 │  Integration Tests    │  ← 30%
                 │  (Jest + Supertest)   │
              ┌──┴───────────────────────┴──┐
              │       Unit Tests            │  ← 60%
              │       (Jest + RTL)          │
              └─────────────────────────────┘
```

### 18.2 Test Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### 18.3 Test Examples

```typescript
// Component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// Hook test
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/use-auth';

describe('useAuth', () => {
  it('starts with loading state', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });
});
```

---

## 19. Appendices

### 19.1 Glossary

| Term | Definition |
|------|------------|
| **Echo** | AI-generated summary of a completed call |
| **Echo Chips** | In-app virtual currency |
| **Emotion Vector** | 8-dimensional embedding representing emotional state |
| **Match** | Pairing between two users based on voice analysis |
| **RLS** | Row Level Security (Supabase/PostgreSQL feature) |
| **SFU** | Selective Forwarding Unit (WebRTC architecture) |
| **Streak** | Consecutive days of app engagement |

### 19.2 Environment Variables Reference

```bash
# Supabase (Auto-configured)
VITE_SUPABASE_URL=https://onmloxbgblyqqufgdulm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon_key>
VITE_SUPABASE_PROJECT_ID=onmloxbgblyqqufgdulm

# External Services (User-configured in Supabase secrets)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_VERIFY_SERVICE_SID=VAxxx
DAILY_API_KEY=xxx
GOOGLE_CLOUD_CREDENTIALS=<base64_json>
DEEPL_API_KEY=xxx
OPENAI_API_KEY=sk-xxx
```

### 19.3 API Rate Limits by Plan

| Plan | API Calls/min | Voice Clips/day | Matches/day | Call Minutes/day |
|------|---------------|-----------------|-------------|------------------|
| Free | 60 | 5 | 10 | 30 |
| Premium | 120 | 20 | 50 | 120 |
| VIP | 300 | Unlimited | Unlimited | Unlimited |

### 19.4 Supported Languages

50+ languages supported for real-time translation, including:
- **Tier 1 (Native quality)**: English, Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese
- **Tier 2 (High quality)**: Russian, Arabic, Hindi, Dutch, Swedish, Polish, Turkish
- **Tier 3 (Good quality)**: Vietnamese, Thai, Indonesian, Filipino, Ukrainian, Bengali, and 30+ more

### 19.5 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2024-12-09 | Engineering Team | Initial specification |

---

**End of Technical Specification Document**

*For questions or clarifications, contact the engineering team.*
