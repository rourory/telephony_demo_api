type ParseSortFunc = (sort: string) => {
  selector: string;
  desc: boolean;
};

export const parseSort: ParseSortFunc = (sort: string) => {
  const bracketIndex = sort.indexOf("[");

  if (bracketIndex === -1) {
    return {
      selector: "",
      desc: false,
    };
  }

  const sorting = sort.substring(bracketIndex + 1, sort.length - 1);

  return JSON.parse(sorting);
};
