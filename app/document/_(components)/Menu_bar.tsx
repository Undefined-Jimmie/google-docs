"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useEditorStore } from "@/store/useEditorStore";
import { useMutation } from "convex/react";
import {
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  Printer,
  Redo2Icon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  TextIcon,
  TrashIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BsFilePdf } from "react-icons/bs";
import { toast } from "sonner";

import RenameDialog from "@/components/EditDialog";
import RemoveDialog from "@/components/RemoveDialog";

interface NavbarProps {
  data: Doc<"documents">;
}

export default function MenuBar({ data }: NavbarProps) {
  const { editor } = useEditorStore();

  const router = useRouter();
  const mutation = useMutation(api.document.create);

  const onNewDocument = () => {
    mutation({
      title: "Untitled Document",
      initialContent: "",
    })
      .then((id) => {
        toast.success("Document created");
        router.push(`/document/${id}`);
      })
      .catch(() => toast.error("Something went wrong"));
  };

  const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: false })
      .run();
  };

  const onDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  };

  const onSaveJson = () => {
    if (!editor) return;
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], {
      type: "application/json",
    });
    onDownload(blob, `${data.title}.json`);
  };

  const onSaveHTML = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], {
      type: "text/html",
    });

    onDownload(blob, `${data.title}.html`);
  };

  const onSaveText = () => {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], {
      type: "text/plain",
    });
    onDownload(blob, `${data.title}.txt`);
  };

  return (
    <>
      <div className={"flex"}>
        <Menubar
          className={"border-none bg-transparent shadow-none h-auto p-0"}
        >
          <MenubarMenu>
            <MenubarTrigger
              className={
                "text-sm font-semibold py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto"
              }
            >
              File
            </MenubarTrigger>
            <MenubarContent className=" print:hidden">
              <MenubarSub>
                <MenubarSubTrigger
                  className={
                    "flex items-center hover:bg-neutral-200 cursor-pointer p-2 hover:text-gray-900"
                  }
                >
                  <FileIcon className={" inline size-4 mr-2"} />
                  <span>Save</span>
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem onClick={onSaveJson}>
                    <FileJsonIcon className={"size-4 mr-2 inline"} />
                    <span>JSON</span>
                  </MenubarItem>
                  <MenubarItem onClick={onSaveHTML}>
                    <GlobeIcon className={"size-4 mr-2 inline"} />
                    <span>HTML</span>
                  </MenubarItem>
                  <MenubarItem onClick={() => window.print()}>
                    <BsFilePdf className={"size-4 mr-2 inline"} />
                    <span>PDF</span>
                  </MenubarItem>
                  <MenubarItem onClick={onSaveText}>
                    <FileTextIcon className={"size-4 mr-2 inline"} />
                    <span>Text</span>
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarItem onClick={onNewDocument}>
                <FilePlusIcon className={"size-4 inline mr-2"} />
                New Document
              </MenubarItem>
              <MenubarSeparator />
              <RenameDialog documentId={data._id} initialTitle={data.title}>
                <MenubarItem
                  onClick={(e) => e.stopPropagation()}
                  onSelect={(e) => e.preventDefault()}
                >
                  <FilePenIcon className={"size-4 inline mr-2"} />
                  Rename
                </MenubarItem>
              </RenameDialog>
              <RemoveDialog documentId={data._id}>
                <MenubarItem
                  onClick={(e) => e.stopPropagation()}
                  onSelect={(e) => e.preventDefault()}
                >
                  <TrashIcon className={"size-4 inline mr-2"} />
                  Remove
                </MenubarItem>
              </RemoveDialog>
              <MenubarSeparator />
              <MenubarItem onClick={() => window.print()}>
                <Printer className={"size-4 mr-2 inline"} />
                Print
                <span>⌘P</span>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger
              className={
                "text-sm font-semibold py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto"
              }
            >
              Edit
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                <Undo2Icon className={"size-4 mr-2 inline"} />
                Undo
                <span>⌘Z</span>
              </MenubarItem>
              <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                <Redo2Icon className={"size-4 mr-2 inline"} />
                Redo
                <span>⌘Y</span>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger
              className={
                "text-sm font-semibold py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto"
              }
            >
              Insert
            </MenubarTrigger>
            <MenubarContent>
              <MenubarSub>
                <MenubarSubTrigger>Table</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem
                    onClick={() => insertTable({ rows: 1, cols: 1 })}
                  >
                    1 * 1
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => insertTable({ rows: 2, cols: 2 })}
                  >
                    2 * 2
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => insertTable({ rows: 3, cols: 3 })}
                  >
                    3 * 3
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => insertTable({ rows: 4, cols: 4 })}
                  >
                    4 * 4
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger
              className={
                "text-sm font-semibold py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto"
              }
            >
              Format
            </MenubarTrigger>
            <MenubarContent>
              <MenubarSub>
                <MenubarSubTrigger>
                  <TextIcon className={" size-4 mr-2 inline"} />
                  Text
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                  >
                    <BoldIcon className={"size-4 mr-2 inline"} />
                    Bold
                    <span>⌘B</span>
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                  >
                    <ItalicIcon className={"size-4 mr-2 inline"} />
                    Italic
                    <span>⌘I</span>
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => {
                      editor?.chain().focus().toggleUnderline().run();
                    }}
                  >
                    <UnderlineIcon className={"size-4 mr-2 inline"} />
                    Underline
                    <span>⌘U</span>
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                  >
                    <StrikethroughIcon className={"size-4 mr-2 inline"} />
                    Strikethrough
                    <span>⌘S</span>
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarItem
                onClick={() => editor?.chain().focus().unsetAllMarks().run()}
              >
                <RemoveFormattingIcon className={"size-4 mr-2 inline"} />
                Clear formatting
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </>
  );
}
