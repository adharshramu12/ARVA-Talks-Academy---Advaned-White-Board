"use client";

import { jsPDF } from "jspdf";
import {
  Document,
  ImageRun,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";
import { boardToDataUrl } from "@/components/board/render";
import { ProjectState, VIRTUAL_H, VIRTUAL_W } from "@/components/board/types";

function dataUrlToUint8(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Export every board to a single landscape PDF (one board per page). */
export async function exportProjectToPdf(project: ProjectState) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [VIRTUAL_W, VIRTUAL_H] });

  for (let i = 0; i < project.boards.length; i++) {
    if (i > 0) pdf.addPage([VIRTUAL_W, VIRTUAL_H], "landscape");
    const img = await boardToDataUrl(project.boards[i], 2);
    pdf.addImage(img, "PNG", 0, 0, VIRTUAL_W, VIRTUAL_H);
  }

  const name = (project.title || "arva-boards").replace(/\s+/g, "-").toLowerCase();
  pdf.save(`${name}.pdf`);
}

/** Export every board to a Word (.docx) document, one image per page. */
export async function exportProjectToWord(project: ProjectState) {
  const imgs = await Promise.all(
    project.boards.map((board) => boardToDataUrl(board, 2))
  );
  const children = project.boards.flatMap((board, i) => {
    const img = imgs[i];
    return [
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: board.name || `Board ${i + 1}` })],
      }),
      new Paragraph({
        children: [
          new ImageRun({
            type: "png",
            data: dataUrlToUint8(img),
            transformation: { width: 640, height: 360 },
          }),
        ],
      }),
      new Paragraph({ children: [new TextRun("")] }),
    ];
  });

  const doc = new Document({
    creator: "Arva Talks Academy",
    title: project.title,
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            children: [new TextRun({ text: project.title || "Arva Talks — Session Notes" })],
          }),
          ...children,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const name = (project.title || "arva-boards").replace(/\s+/g, "-").toLowerCase();
  saveAs(blob, `${name}.docx`);
}

/** Export just the current board as a PNG image. */
export async function exportBoardToPng(project: ProjectState, boardId: string) {
  const board = project.boards.find((b) => b.id === boardId);
  if (!board) return;
  const img = await boardToDataUrl(board, 2);
  const a = document.createElement("a");
  a.href = img;
  a.download = `${(board.name || "board").replace(/\s+/g, "-").toLowerCase()}.png`;
  a.click();
}
