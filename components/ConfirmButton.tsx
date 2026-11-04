'use client';

export function ConfirmButton({ message, children, ...rest }: { message: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...rest} onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>{children}</button>;
}
