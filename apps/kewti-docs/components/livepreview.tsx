"use client";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import React from 'react';
import { KewtiInput } from '@workspace/ui/components/kewti-inputs/component';
import { KewtiLocationSelector } from '@workspace/ui/components/kewti-location-selector/component';
import { KewtiCalendar, KewtiDatePicker } from '@workspace/ui/components/kewti-calender/component';
import { KewtiFonts, KewtiPronounce } from '@workspace/ui/components/kewti-fonts/component';
import { KewtiTime } from '@workspace/ui/components/kewti-time/component';
import { KewtiNumerals } from '@workspace/ui/components/kewti-numerals/component';
import KewtiSpell from '@workspace/ui/components/kewti-spell/component';
import { KewtiSelect } from '@workspace/ui/components/kewti-select/component';
import { Landmark } from 'lucide-react';
import { University } from 'lucide-react';
import Kenat from 'kenat';

const scope = { React, KewtiInput, Landmark, University, KewtiNumerals, KewtiSpell, KewtiLocationSelector, KewtiCalendar, KewtiDatePicker, KewtiTime, KewtiPronounce, KewtiFonts, KewtiSelect, Kenat, useState: React.useState };

export function CodePlayground({ defaultCode }: { defaultCode: string }) {
  return (
    <div className="my-6 border rounded-lg overflow-hidden border-fd-border bg-fd-card">
      <LiveProvider code={defaultCode} scope={scope} noInline={true}>
        <div className="p-4 border-b border-gray-300 dark:border-gray-800 bg-gray-200 dark:bg-zinc-800 flex justify-center items-center min-h-[300px]">
          <LivePreview />
        </div>

        {/* Editable Code Editor Panel */}
        <div className="p-2 bg-fd-secondary text-sm font-mono">
          <LiveEditor className="focus-visible:outline-none" />
        </div>

        {/* Error Output Panel */}
        <LiveError className="p-2 text-xs text-red-500 bg-red-500/10 font-mono border-t border-fd-border" />
      </LiveProvider>
    </div>
  );
}
