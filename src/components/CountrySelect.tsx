'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Country,
  getCountryCallingCode,
  FlagProps,
} from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import 'react-phone-number-input/style.css';

const Flag = ({ country, countryName, className, ...rest }: FlagProps & { className?: string }) => {
  const FlagComponent = flags[country];
  if (!FlagComponent) {
    return null; // Or some fallback UI
  }
  // The `countryName` prop is destructured and not passed to the div or FlagComponent
  return (
    <div className={cn("h-4 w-6 overflow-hidden rounded-sm", className)}>
      <FlagComponent title={countryName} {...rest} />
    </div>
  );
};

interface CountrySelectProps {
  value: Country;
  onChange: (value: Country) => void;
  options: { value: Country; label: string; icon: React.ComponentType<FlagProps> }[];
}

export function CountrySelect({
  value,
  onChange,
  options,
  // Destructure and discard the props that are not valid for a button element
  countryName,
  iconComponent,
  key,
  ...rest
}: CountrySelectProps & { [key: string]: any }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between"
          {...rest}
        >
          {value ? (
            <div className="flex items-center">
              <Flag country={value} countryName={value} className="mr-2" />
              {options.find((option) => option.value === value)?.label} (+
              {getCountryCallingCode(value)})
            </div>
          ) : (
            'Select country'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 bg-white">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((option) => option.value) // Filter out divider
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <Flag country={option.value} countryName={option.label} className="mr-2" />
                    {option.label}
                    <span className="ml-auto text-gray-500">
                      +{getCountryCallingCode(option.value)}
                    </span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
