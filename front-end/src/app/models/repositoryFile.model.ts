export interface RepositoryFile {
  year: string;
  months: {
    month: number;
    monthName: string;
    fileNames: { filename: string, iconClass: string }[];
  }[];
}
