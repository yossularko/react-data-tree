import { Typography } from "antd";
import { useMemo } from "react";
import { generateDataFlat, generateDataTree } from "./utils/myFunction";
import dataList, { DataList, DataListChild } from "./utils/dataList";

const { Title } = Typography;

function App() {
  const dataTree = useMemo(() => {
    const newVal = generateDataTree<DataListChild, DataList>(
      dataList,
      "parent_id",
      "id"
    );
    return newVal;
  }, []);

  const dataFlat = useMemo(() => {
    const newVal = generateDataFlat(dataTree) as DataList[];
    return newVal;
  }, [dataTree]);

  return (
    <div
      style={{
        maxWidth: "1280px",
        marginInline: "auto",
        padding: 10,
        paddingTop: 30,
      }}
    >
      <Title>React Data Tree</Title>
      <Title level={4}>Data Default</Title>
      <pre>
        <code>{JSON.stringify(dataList, null, 2)}</code>
      </pre>
      <Title level={4}>Data Tree</Title>
      <pre>
        <code>{JSON.stringify(dataTree, null, 2)}</code>
      </pre>
      <Title level={4}>Data Flat</Title>
      <pre>
        <code>{JSON.stringify(dataFlat, null, 2)}</code>
      </pre>
    </div>
  );
}

export default App;
