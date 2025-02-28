import { Response } from 'express';

interface FileResponse {
  file: Uint8Array;
  filename: string;
  res: Response;
  type: 'application/pdf' | 'application/xlsx' | 'application/csv';
}

export function responseFile({ file, filename, res, type }: FileResponse) {
  const fileNameRemoveAccents = filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  res.setHeader('Content-Type', `${type}; charset=UTF-8`);
  res.setHeader('Content-Disposition', `attachment; filename="${fileNameRemoveAccents}"`);
  res.setHeader('Content-Length', file.length);
  res.end(file);
}