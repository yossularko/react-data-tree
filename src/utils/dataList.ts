export interface DataList {
  id: string;
  name: string;
  description: string;
  parent_id: string | null;
}

export interface DataListChild extends DataList {
  children?: DataList[];
}

export type Inputs =
  | ({ type: "add" } & Omit<DataList, "id">)
  | ({ type: "update" } & DataList);

const dataList: DataList[] = [
  {
    id: "840baeb9-db30-40e1-8fc4-51f0691dfb79",
    name: "Parent 1",
    description: "description..",
    parent_id: null,
  },
  {
    id: "b53a5ab0-8175-49cc-b16d-bd1c37b8ef99",
    name: "Parent 2",
    description: "description..",
    parent_id: null,
  },
  {
    id: "375121ab-7d89-419f-b1e1-86aeccc28eba",
    name: "Child Test",
    description: "description..",
    parent_id: "840baeb9-db30-40e1-8fc4-51f0691dfb79",
  },
];

export default dataList;
