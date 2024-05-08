import { Button, Space, Typography, Table } from "antd";
import { useCallback, useMemo, useState } from "react";
import { generateDataFlat, generateDataTree } from "./utils/myFunction";
import dataList, { DataList, DataListChild, Inputs } from "./utils/dataList";
import { ColumnsType } from "antd/es/table";
import { FiEdit3, FiTrash } from "react-icons/fi";
import ModalInput from "./components/ModalInput";
import { v4 as uuidv4 } from "uuid";

const { Title, Text } = Typography;

function App() {
  const [data, setData] = useState(dataList);
  const [isOpen, setIsOpen] = useState(false);
  const [dataTemp, setDataTemp] = useState<DataList | null>(null);
  const [hideDefault, setHideDefaul] = useState(false);

  const dataTree = useMemo(() => {
    const newVal = generateDataTree<DataListChild, DataList>(
      data,
      "parent_id",
      "id"
    );
    return newVal;
  }, [data]);

  const dataFlat = useMemo(() => {
    const newVal = generateDataFlat(dataTree);
    return newVal;
  }, [dataTree]);

  const handleAction = useCallback(
    (type: "add" | "update" | "delete", record: DataListChild | null) => {
      if (type === "delete") {
        setData((prev) => prev.filter((item) => item.id !== record?.id));
        return;
      }

      if (type === "add") {
        setDataTemp(null);
        setIsOpen(true);
        return;
      }

      const dataSet = record
        ? {
            id: record.id,
            name: record.name,
            description: record.description,
            parent_id: record.parent_id,
          }
        : null;

      setDataTemp(dataSet);
      setIsOpen(true);
    },
    []
  );

  const handleFinish = useCallback((value: Inputs) => {
    if (value.type === "update") {
      const { id, name, description, parent_id } = value;
      setData((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return { ...item, name, description, parent_id };
          }

          return item;
        })
      );
      return;
    }

    const { name, description, parent_id } = value;
    setData((prev) => [
      ...prev,
      { id: uuidv4(), name, description, parent_id },
    ]);
  }, []);

  const columns = useMemo(() => {
    const initData: ColumnsType<DataListChild> = [
      {
        title: "Name",
        dataIndex: "name",
        render: (text, record) => (
          <Text
            strong
            style={{ cursor: "pointer" }}
            onClick={() => handleAction("update", record)}
          >
            {text}
          </Text>
        ),
      },
      {
        title: "Description",
        dataIndex: "description",
      },
      {
        key: "action",
        title: "Action",
        render: (_, record) => {
          return (
            <Space size="small">
              <Button
                aria-label="edit"
                icon={<FiEdit3 />}
                size="small"
                onClick={() => handleAction("update", record)}
              />
              <Button
                aria-label="delete"
                icon={<FiTrash />}
                danger
                size="small"
                onClick={() => handleAction("delete", record)}
              />
            </Space>
          );
        },
        width: 100,
      },
    ];

    return initData;
  }, [handleAction]);

  return (
    <>
      <ModalInput
        visisble={isOpen}
        onClose={() => setIsOpen(false)}
        record={dataTemp}
        dataParent={data}
        onFinish={handleFinish}
      />
      <div
        style={{
          maxWidth: "1280px",
          marginInline: "auto",
          padding: 10,
          paddingTop: 30,
        }}
      >
        <Title>React Data Tree</Title>
        <Button type="primary" onClick={() => handleAction("add", null)}>
          Add Data
        </Button>
        {hideDefault ? null : (
          <>
            <Title level={4}>Data Default</Title>
            <Button onClick={() => setHideDefaul(true)}>
              Hide Default Data
            </Button>
            <Table
              columns={columns}
              dataSource={data}
              rowKey={(record) => record.id}
              scroll={{ y: 300 }}
              size="small"
              bordered
            />
          </>
        )}
        <Title level={4}>Data Tree</Title>
        <Table
          columns={columns}
          dataSource={dataTree}
          rowKey={(record) => record.id}
          scroll={{ y: 300 }}
          size="small"
          bordered
        />
        <Title level={4}>Data Flat</Title>
        <Table
          columns={columns}
          dataSource={dataFlat}
          rowKey={(record) => record.id}
          scroll={{ y: 300 }}
          size="small"
          bordered
        />
      </div>
    </>
  );
}

export default App;
