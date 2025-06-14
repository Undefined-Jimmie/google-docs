// eslint-disable no-unused-vars
"use client";
import { fontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import { useEditorStore } from "@/store/useEditorStore";
import {
  FloatingToolbar,
  useLiveblocksExtension,
} from "@liveblocks/react-tiptap";
import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Heading from "@tiptap/extension-heading";
import Hightlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import Ruler from "../_(components)/Ruler";
import Threads from "./Threads";
import { useStorage } from "@liveblocks/react/suspense";

interface EditorProps {
  initialContent?: string | undefined;
}

export default function Editor({ initialContent }: EditorProps) {
  const liveblocks = useLiveblocksExtension({
    initialContent,
    offlineSupport_experimental: true,
  });

  const { setEditor } = useEditorStore();
  const leftMargin = useStorage((root) => root.leftMargin);
  const rightMargin = useStorage((root) => root.rightMargin);

  const editor = useEditor({
    autofocus: true,
    immediatelyRender: false,
    onCreate: ({ editor }) => {
      setEditor(editor);
    },
    onDestroy: () => {
      setEditor(null);
    },
    onUpdate: ({ editor }) => {
      setEditor(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      setEditor(editor);
    },
    onTransaction: ({ editor }) => {
      setEditor(editor);
    },
    onFocus: ({ editor }) => {
      setEditor(editor);
    },
    onBlur: ({ editor }) => {
      setEditor(editor);
    },
    onContentError: ({ editor }) => {
      setEditor(editor);
    },

    editorProps: {
      attributes: {
        style: `padding-left:${leftMargin ?? 56}px; padding-right: ${
          rightMargin ?? 56
        }px`,
        class:
          "focus:outline-none print:border-0 bg-white border border-[#c7c7c7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        history: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      TaskList,
      LineHeightExtension.configure({
        types: ["paragraph", "heading"],
        defaultLineHeight: "normal",
      }),
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      ImageResize,
      Underline,
      Hightlight.configure({ multicolor: true }),
      Color,
      fontSizeExtension,
    ],
  });

  return (
    <div
      className={
        "size-full  overflow-x-auto bg-[#F9FBFD] print:p-0 print:bg-white print:overflow-visible"
      }
    >
      <Ruler />
      <div
        className={
          "min-w-max flex -z-10 justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0"
        }
      >
        <EditorContent editor={editor} />
        <Threads editor={editor} />
        <FloatingToolbar editor={editor} />
      </div>
    </div>
  );
}
