import Link from "next/link";

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

export const NavigationCard = ({
  title,
  description,
  href,
  icon,
}: NavigationCardProps) => {
  return (
    <Link
      href={href}
      className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-4">
        {icon && <span className="text-3xl">{icon}</span>}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </Link>
  );
};
