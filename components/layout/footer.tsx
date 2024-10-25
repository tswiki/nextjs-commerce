// Footer.tsx

import Link from 'next/link';
import FooterMenu from 'components/layout/footer-menu';
import LogoSquare from 'components/logo-square';
import { getMenu } from 'lib/shopify';
import { Suspense } from 'react';
import { Menu } from 'lib/shopify/types';

const { COMPANY_NAME, SITE_NAME } = process.env;

// Utility function to add timeout to promises
function promiseWithTimeout<T>(ms: number, promise: Promise<T>): Promise<T> {
  const timeout = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );
  return Promise.race([promise, timeout]);
}

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const startYear = 2023;
  const copyrightDate =
    currentYear > startYear ? `${startYear}-${currentYear}` : `${startYear}`;
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700';

  // Initialize menu as an empty array to satisfy TypeScript
  let menu: Menu[] = [];

  try {
    const fetchedMenu = await promiseWithTimeout(5000, getMenu('next-js-frontend-footer-menu')); // 5-second timeout
    if (Array.isArray(fetchedMenu)) {
      menu = fetchedMenu;
    } else {
      console.error('getMenu did not return an array:', fetchedMenu);
      // Optionally, set menu to a default value or leave it as []
    }
  } catch (error) {
    console.error('Failed to fetch footer menu:', error);
    // menu remains as an empty array
  }

  const copyrightName =
    COMPANY_NAME || SITE_NAME || 'Your Company Name'; // Fallback to a default name

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <div>
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            <LogoSquare size="sm" />
            <span className="uppercase">{SITE_NAME || 'Site Name'}</span>
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-col gap-2">
              {[...Array(6)].map((_, index) => (
                <div key={index} className={skeleton} />
              ))}
            </div>
          }
        >
          {/* Always pass a Menu[] to FooterMenu */}
          <FooterMenu menu={menu} />
        </Suspense>
        <div className="md:ml-auto">
          <a
            className="flex h-8 w-max flex-none items-center justify-center rounded-md border border-neutral-200 bg-white text-xs text-black dark:border-neutral-700 dark:bg-black dark:text-white"
            aria-label="Deploy on Vercel"
            href="https://vercel.com/templates/next.js/nextjs-commerce"
          >
            <span className="px-3">▲</span>
            <hr className="h-full border-r border-neutral-200 dark:border-neutral-700" />
            <span className="px-3">Deploy</span>
          </a>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
          <p>
            <a href="https://github.com/vercel/commerce">View the source</a>
          </p>
          <p className="md:ml-auto">
            <a href="https://vercel.com" className="text-black dark:text-white">
              Created by ▲ Vercel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
