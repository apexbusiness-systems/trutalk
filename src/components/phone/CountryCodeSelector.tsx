import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { countryCodes, type CountryCode } from "@/lib/country-codes";
import { cn } from "@/lib/utils";

interface CountryCodeSelectorProps {
  value: CountryCode;
  onChange: (country: CountryCode) => void;
  disabled?: boolean;
}

export function CountryCodeSelector({
  value,
  onChange,
  disabled = false,
}: CountryCodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.dial_code.includes(search) ||
      country.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-1.5 h-12 px-3 rounded-l-lg border border-r-0 border-input bg-secondary/50",
          "text-sm font-medium transition-colors",
          "hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className="text-lg">{value.flag}</span>
        <span className="text-foreground">{value.dial_code}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 w-72 max-h-80 overflow-hidden rounded-lg border border-border bg-popover shadow-xl animate-in fade-in-0 zoom-in-95">
          {/* Search input */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-md bg-secondary/50 border border-input text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Country list */}
          <div className="overflow-y-auto max-h-60">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No countries found
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={`${country.code}-${country.dial_code}`}
                  type="button"
                  onClick={() => {
                    onChange(country);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2.5 text-left transition-colors",
                    "hover:bg-secondary/50 focus:bg-secondary/50 focus:outline-none",
                    value.code === country.code && "bg-primary/10"
                  )}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="flex-1 text-sm text-foreground truncate">
                    {country.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {country.dial_code}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
