declare module "papaparse" {
  export type ParseError = {
    type: string;
    code: string;
    message: string;
    row?: number;
  };

  export type ParseResult<T> = {
    data: T[];
    errors: ParseError[];
    meta: { fields?: string[] };
  };

  export type ParseConfig<T> = {
    header?: boolean;
    skipEmptyLines?: boolean | "greedy";
    transformHeader?: (header: string) => string;
    complete?: (results: ParseResult<T>) => void;
    error?: (error: Error) => void;
  };

  const Papa: {
    parse<T>(file: File | string, config: ParseConfig<T>): void;
  };

  export default Papa;
}
