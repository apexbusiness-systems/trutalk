import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Apple, Download as DownloadIcon, Smartphone } from 'lucide-react';

export default function DownloadPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="container mx-auto px-4 py-6">
        <Link href="/">
          <h1 className="text-2xl font-bold gradient-text">TRU Talk</h1>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Smartphone className="w-24 h-24 mx-auto mb-8 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Download TRU Talk
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Get the app and start connecting through voice today
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 h-auto"
              asChild
            >
              <a
                href="https://apps.apple.com/app/trutalk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Apple className="mr-2" />
                Download for iOS
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 h-auto"
              asChild
            >
              <a
                href="https://play.google.com/store/apps/details?id=com.trutalk.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadIcon className="mr-2" />
                Download for Android
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Coming soon to iOS and Android
          </p>
        </div>
      </main>
    </div>
  );
}


