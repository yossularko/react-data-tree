import { useEffect, useMemo } from "react";
import { DataList, Inputs } from "../utils/dataList";
import { Button, Form, Input, Modal, TreeSelect, message } from "antd";
import { generateDataTree } from "../utils/myFunction";
import { BaseOptionType } from "antd/es/select";
import { FiNavigation, FiRefreshCcw } from "react-icons/fi";

interface Props {
  visisble: boolean;
  onClose: () => void;
  record: DataList | null;
  onFinish: (value: Inputs) => void;
  dataParent: DataList[];
}

interface DataListSelect extends DataList {
  disabled?: boolean;
}

export interface DataListChildSelect extends DataListSelect {
  children?: DataListChildSelect[];
}

const recursiveData = (dataArr: DataListChildSelect[]): BaseOptionType[] => {
  return dataArr.map((item) => {
    if (item.children) {
      return {
        label: item.name,
        value: item.id,
        disabled: item.disabled,
        children: recursiveData(item.children),
      };
    }

    return {
      label: item.name,
      value: item.id,
      disabled: item.disabled,
    };
  });
};

const generateList = (date: DataListSelect[]) => {
  const dataTree = generateDataTree<DataListChildSelect, DataListSelect>(
    date,
    "parent_id",
    "id"
  );

  const finalData = recursiveData(dataTree);

  return finalData;
};

const ModalInput = ({
  visisble,
  onClose,
  record,
  onFinish,
  dataParent,
}: Props) => {
  const [form] = Form.useForm<Omit<DataList, "id">>();

  const newParentList = useMemo(() => {
    const newVal = dataParent.map((val) => {
      if (record) {
        if (val.id === record.id) {
          return {
            ...val,
            disabled: true,
          };
        }
      }

      return val;
    });

    const master = generateList(newVal);

    return [
      {
        label: "Top Parent",
        value: "",
      },
      ...master,
    ];
  }, [dataParent, record]);

  const onSubmit = (dataSubmit: Omit<DataList, "id">) => {
    const { name, description, parent_id } = dataSubmit;
    if (record) {
      if (!record.id) {
        message.warning("Currency Id tidak ditemukan!");
        return;
      }

      onFinish({
        type: "update",
        id: record.id,
        name,
        description,
        parent_id: parent_id || null,
      });
      onClose();
      form.resetFields();
      return;
    }

    onFinish({ type: "add", name, description, parent_id: parent_id || null });
    onClose();
    form.resetFields();
  };

  const onError = (errorSubmit: any) => {
    console.log("error submit: ", errorSubmit);
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        parent_id: record.parent_id,
      });
    } else {
      form.resetFields();
    }
  }, [record, form]);

  return (
    <Modal
      title={record ? "Update Data" : "Add Data"}
      open={visisble}
      onCancel={onClose}
      footer={false}
    >
      <Form
        form={form}
        name="input-currency"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onError}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="input name" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea placeholder="input name" />
        </Form.Item>
        <Form.Item name="parent_id" label="Parent">
          <TreeSelect
            placeholder="select parent"
            treeDefaultExpandAll={false}
            treeData={newParentList}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            shape="round"
            icon={
              record ? (
                <FiRefreshCcw style={{ marginRight: "6px" }} />
              ) : (
                <FiNavigation style={{ marginRight: "6px" }} />
              )
            }
            htmlType="submit"
          >
            {record ? "Update Data" : "Add Data"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalInput;
