"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Fuse, { type IFuseOptions } from "fuse.js";

export interface DictionaryEntry {
  word: string;
  freq: number;
}

export interface CorrectorIndex {
  fuse: Fuse<DictionaryEntry>;
  wordSet: Set<string>;
  freqMap: Map<string, number>;
  maxFreq: number;
}

export interface Suggestion {
  word: string;
  freq: number;
  similarity: number;
  combined: number;
}

export interface SpellCorrectorProps {
  dictionaryText?: string;
  index?: CorrectorIndex;
  maxSuggestions?: number;
  children: React.ReactElement;
  renderLoading?: () => React.ReactNode;
  onDictionaryLoaded?: (err?: Error) => void;
}

interface ActiveWordContext {
  word: string;
  tokenIndex: number;
  top: number;
  left: number;
  suggestions: Suggestion[];
}

export function parseDictionary(text?: string): DictionaryEntry[] {
  if (!text) return [];
  const entries: DictionaryEntry[] = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 2) continue;
    const word = parts[0];
    const freq = Number(parts[1].replace(/,/g, ""));
    if (!word || Number.isNaN(freq)) continue;
    entries.push({ word, freq });
  }
  return entries;
}

export function buildCorrectorIndex(
  entries: DictionaryEntry[],
  fuseOptions: IFuseOptions<DictionaryEntry> = {}
): CorrectorIndex {
  const wordSet = new Set<string>();
  const freqMap = new Map<string, number>();
  let maxFreq = 1;

  for (const { word, freq } of entries) {
    wordSet.add(word);
    freqMap.set(word, freq);
    if (freq > maxFreq) maxFreq = freq;
  }

  const fuse = new Fuse<DictionaryEntry>(entries, {
    keys: ["word"],
    includeScore: true,
    threshold: 0.4,
    distance: 40,
    minMatchCharLength: 1,
    ignoreLocation: true,
    ...fuseOptions,
  });

  return { fuse, wordSet, freqMap, maxFreq };
}

function rankSuggestions(
  fuse: Fuse<DictionaryEntry>,
  freqMap: Map<string, number>,
  maxFreq: number,
  query: string,
  limit: number
): Suggestion[] {
  const results = fuse.search(query, { limit: Math.max(limit * 4, 20) });

  return results
    .map((r) => {
      const score = r.score ?? 1;
      const freq = freqMap.get(r.item.word) || 0;
      const freqScore = Math.log(freq + 1) / Math.log(maxFreq + 1);
      const combined = score - freqScore * 0.35;
      return { word: r.item.word, freq, similarity: 1 - score, combined };
    })
    .sort((a, b) => a.combined - b.combined)
    .slice(0, limit);
}

export default function KewtiSpell({
  dictionaryText,
  index,
  maxSuggestions = 5,
  renderLoading,
  onDictionaryLoaded,
  children,
}: SpellCorrectorProps) {
  const [loadedText, setLoadedText] = useState<string>(dictionaryText || "");
  const [isLoading, setIsLoading] = useState<boolean>(!index && !dictionaryText);

  // Detect whether child is a textarea
  const child = React.Children.only(children) as React.ReactElement<any>;
  const isTextarea = Boolean(
    child.type === "textarea" ||
    child.props.rows !== undefined ||
    (typeof child.type === "function" &&
      (child.type.name === "Textarea" || (child.type as any).displayName === "Textarea"))
  );

  useEffect(() => {
    if (dictionaryText) {
      setLoadedText(dictionaryText);
      setIsLoading(false);
    }
  }, [dictionaryText]);

  // Load from local dictionary.ts only
  useEffect(() => {
    if (index || dictionaryText) return;

    let isMounted = true;
    setIsLoading(true);

    import("./dictionary")
      .then((mod) => {
        if (!isMounted) return;
        setLoadedText(mod.defaultDictionary || mod.default || "");
        setIsLoading(false);
        onDictionaryLoaded?.();
      })
      .catch((err) => {
        if (!isMounted) return;
        setIsLoading(false);
        onDictionaryLoaded?.(err);
      });

    return () => {
      isMounted = false;
    };
  }, [index, dictionaryText, onDictionaryLoaded]);

  const parsedEntries = useMemo(
    () => (index ? null : parseDictionary(loadedText)),
    [loadedText, index]
  );

  const { fuse, wordSet, freqMap, maxFreq } = useMemo(
    () => index || buildCorrectorIndex(parsedEntries || []),
    [index, parsedEntries]
  );

  const isControlled = child.props.value !== undefined;
  const [internalText, setInternalText] = useState<string>(
    child.props.value || child.props.defaultValue || ""
  );

  const text = isControlled ? child.props.value : internalText;
  const [activeWord, setActiveWord] = useState<ActiveWordContext | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const tokenSpanRefs = useRef<Map<number, HTMLSpanElement>>(new Map());

  const [computedStyles, setComputedStyles] = useState<React.CSSProperties>({});
  const [customSize, setCustomSize] = useState<{ width?: number; height?: number }>({});

  const updateComputedStyles = useCallback(() => {
    if (!childRef.current) return;
    const cs = window.getComputedStyle(childRef.current);
    setComputedStyles({
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      letterSpacing: cs.letterSpacing,
      lineHeight: cs.lineHeight,
      whiteSpace: cs.whiteSpace as any,
      wordBreak: cs.wordBreak as any,
      overflowWrap: cs.overflowWrap as any,
      textAlign: cs.textAlign as any,
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom,
      paddingLeft: cs.paddingLeft,
      borderTopWidth: cs.borderTopWidth,
      borderRightWidth: cs.borderRightWidth,
      borderBottomWidth: cs.borderBottomWidth,
      borderLeftWidth: cs.borderLeftWidth,
      boxSizing: cs.boxSizing as any,
    });
  }, []);

  // ResizeObserver tracks horizontal and vertical resizing of the textarea
  useEffect(() => {
    if (!childRef.current) return;
    updateComputedStyles();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (isTextarea) {
          setCustomSize({
            width: entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width,
            height: entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height,
          });
        }
        updateComputedStyles();
      }
    });

    ro.observe(childRef.current);
    return () => ro.disconnect();
  }, [isTextarea, updateComputedStyles]);

  const tokens = useMemo(() => {
    return (text || "").split(/([\s.,!?()"'፤፡።]+)/);
  }, [text]);

  const handleInputClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (isLoading || wordSet.size === 0) return;

      const input = e.currentTarget;
      const cursorIndex = input.selectionStart || 0;

      let currentIndex = 0;
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const tokenStart = currentIndex;
        const tokenEnd = currentIndex + token.length;

        if (cursorIndex >= tokenStart && cursorIndex <= tokenEnd) {
          const isWord = /^[^\s.,!?()"'፤፡።]+$/.test(token);
          const isMisspelled = isWord && !wordSet.has(token);

          if (isMisspelled) {
            const suggestions = rankSuggestions(
              fuse,
              freqMap,
              maxFreq,
              token,
              maxSuggestions
            );

            const containerRect = containerRef.current?.getBoundingClientRect();
            const spanEl = tokenSpanRefs.current.get(i);

            let top = 0;
            let left = 0;

            if (containerRect && spanEl) {
              const spanRect = spanEl.getBoundingClientRect();
              top = spanRect.bottom - containerRect.top + 4;
              left = spanRect.left - containerRect.left;
            } else if (containerRect) {
              top = e.clientY - containerRect.top + 16;
              left = e.clientX - containerRect.left;
            }

            setActiveWord({
              word: token,
              tokenIndex: i,
              top,
              left,
              suggestions,
            });
          } else {
            setActiveWord(null);
          }
          break;
        }
        currentIndex += token.length;
      }
    },
    [tokens, wordSet, fuse, freqMap, maxFreq, maxSuggestions, isLoading]
  );

  const setNativeValue = (element: HTMLElement, value: string) => {
    let proto = Object.getPrototypeOf(element);
    let descriptor: PropertyDescriptor | undefined;

    // Walk up the prototype chain of the actual element (<input> or <textarea>)
    while (proto) {
      descriptor = Object.getOwnPropertyDescriptor(proto, "value");
      if (descriptor?.set) break;
      proto = Object.getPrototypeOf(proto);
    }

    if (descriptor?.set) {
      descriptor.set.call(element, value);
    } else {
      (element as any).value = value;
    }
  };

  const applySuggestion = (replacement: string) => {
    if (!activeWord || !childRef.current) return;

    const newTokens = [...tokens];
    newTokens[activeWord.tokenIndex] = replacement;
    const updatedText = newTokens.join("");

    const input = childRef.current;

    // Safely sets value on either <input> or <textarea> without Illegal Invocation
    setNativeValue(input, updatedText);

    // Dispatch input event so React's onChange fires
    input.dispatchEvent(new Event("input", { bubbles: true }));

    if (!isControlled) {
      setInternalText(updatedText);
    }

    setActiveWord(null);
    input.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveWord(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clonedChild = React.cloneElement(child, {
    ref: (node: HTMLInputElement | HTMLTextAreaElement) => {
      childRef.current = node;
      const { ref } = child as any;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!isControlled) setInternalText(e.target.value);
      if (activeWord) setActiveWord(null);
      child.props.onChange?.(e);
    },
    onClick: (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleInputClick(e);
      child.props.onClick?.(e);
    },
    onScroll: (e: React.UIEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (overlayRef.current) {
        overlayRef.current.scrollTop = e.currentTarget.scrollTop;
        overlayRef.current.scrollLeft = e.currentTarget.scrollLeft;
      }
      if (activeWord) setActiveWord(null);
      child.props.onScroll?.(e);
    },
    spellCheck: false,
    className: child.props.className,
    style: {
      ...child.props.style,
      position: "relative",
      zIndex: 2,
      background: "transparent",
      // Unrestrict horizontal movement and resizing for textareas
      ...(isTextarea && {
        resize: child.props.style?.resize ?? "both",
        maxWidth: "none",
      }),
    },
  });

  return (
    <div
      ref={containerRef}
      className={`relative ${isTextarea ? "max-w-none inline-block" : "w-full flex-1"}`}
      style={{
        minWidth: 0,
        width: isTextarea && customSize.width ? `${customSize.width}px` : "100%",
        height: isTextarea && customSize.height ? `${customSize.height}px` : undefined,
      }}
    >
      {isLoading && renderLoading && renderLoading()}

      {/* Underline layer - computed styles mirror textarea wrap and scroll */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-[1] pointer-events-none overflow-hidden border-transparent text-transparent select-none"
        style={computedStyles}
        aria-hidden="true"
      >
        {tokens.map((token, index) => {
          const isWord = /^[^\s.,!?()"'፤፡።]+$/.test(token);
          const isMisspelled =
            !isLoading && isWord && wordSet.size > 0 && !wordSet.has(token);

          if (isMisspelled) {
            return (
              <span
                key={index}
                ref={(el) => {
                  if (el) tokenSpanRefs.current.set(index, el);
                  else tokenSpanRefs.current.delete(index);
                }}
                className="underline decoration-wavy decoration-[#D93025]"
                style={{ textDecorationSkipInk: "none" }}
              >
                {token}
              </span>
            );
          }

          return <React.Fragment key={index}>{token}</React.Fragment>;
        })}
      </div>

      {clonedChild}

      {/* Suggestion Popover */}
      {activeWord && (
        <div
          className="absolute z-50 min-w-[150px] rounded-lg border py-1.5 text-sm select-none shadow-xl
            bg-white text-zinc-900 border-zinc-200
            dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800"
          style={{
            top: activeWord.top,
            left: Math.max(
              0,
              Math.min(
                activeWord.left,
                (containerRef.current?.clientWidth || 300) - 160
              )
            ),
          }}
        >
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Suggestions
          </div>

          {activeWord.suggestions.length > 0 ? (
            activeWord.suggestions.map((s) => (
              <button
                key={s.word}
                type="button"
                onClick={() => applySuggestion(s.word)}
                className="flex w-full cursor-pointer items-center px-3 py-1.5 text-left text-sm font-medium transition-colors
                  text-black hover:bg-zinc-100
                  dark:text-white dark:hover:bg-zinc-800/80"
              >
                {s.word}
              </button>
            ))
          ) : (
            <div className="px-3 py-1.5 text-xs italic text-zinc-400 dark:text-zinc-500">
              No suggestions
            </div>
          )}
        </div>
      )}
    </div>
  );
}