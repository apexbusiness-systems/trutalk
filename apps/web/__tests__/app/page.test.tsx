/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('HomePage', () => {
  it('renders the hero title', () => {
    render(<HomePage />);
    expect(screen.getByText(/Connect Through Voice/i)).toBeInTheDocument();
  });

  it('renders the download button', () => {
    render(<HomePage />);
    expect(screen.getByText(/Download App/i)).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<HomePage />);
    expect(screen.getByText(/Break Language Barriers/i)).toBeInTheDocument();
    expect(screen.getByText(/Authentic Conversations/i)).toBeInTheDocument();
    expect(screen.getByText(/Global Community/i)).toBeInTheDocument();
  });

  it('has correct links', () => {
    render(<HomePage />);
    const downloadLink = screen.getByText(/Download App/i).closest('a');
    expect(downloadLink).toHaveAttribute('href', '/download');
  });
});


