import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2.5 select-none">
          <Image
            src="/logolight.png"
            alt="Kewti"
            width={100}
            height={20}
            className="h-5 w-auto object-contain dark:hidden"
          />

          <Image
            src="/logo.png"
            alt="Kewti"
            width={100}
            height={20}
            className="hidden h-5 w-auto object-contain dark:block"
          />
          <i>
            <h1 className="font-sans text-2xl font-bold text-orange-500">
              Docs
            </h1>
          </i>
        </div>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}