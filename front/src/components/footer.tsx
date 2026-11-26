import type { ComponentPropsWithoutRef } from "react";
import { cacheLife } from "next/cache";

export default async function MyFooter(
  props: ComponentPropsWithoutRef<"footer">
) {
  "use cache";

  const now = new Date();
  const year = now.getFullYear();
  const nextNewYear = new Date(year + 1, 0, 1, 0, 0, 0, 0);
  const secondsUntilNewYear = Math.max(
    1,
    Math.ceil((nextNewYear.getTime() - now.getTime()) / 1000)
  );

  cacheLife({
    stale: Math.min(secondsUntilNewYear, 60 * 60 * 24),
    revalidate: secondsUntilNewYear,
    expire: secondsUntilNewYear + 60,
  });

  return (
    <footer role="contentinfo" {...props} className="bg-gray-900 text-white py-4 px-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {year} fruitful market ug. All rights reserved.
        </p>
      </div>
    </footer>
  );
}