import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Button,
} from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import { EditOutlined, DeleteTwoTone } from "@ant-design/icons";

/* use Search to search the table Input */
const { Search } = Input;
/* use Data to store the data */
const Data = [];
/* use EditableTable to store the table */
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Users = () => {
  /* use form to store the form */
  const [form] = Form.useForm();
  /* use let to assign the filtered data after search * */
  let [data, setData] = useState(Data);
  /* use editing to store the editing status */
  const [editingKey, setEditingKey] = useState("");
  /* use loading to store the loading status */
  const [loading, setLoading] = useState(false);
  /* use filtered to store the filtered data */
  const [filter, setFilter] = useState("");
  /* use selectedData to store the selected data */
  const [selectedData, setSelectedData] = useState([]);
  data =
    data &&
    data.filter((item) => {
      return Object.keys(item).some((key) =>
        item[key].toLowerCase().includes(filter)
      );
    });
  /* use removeId to store the id of the data to be removed */
  const removeId = (id) => {
    data = data.filter((item) => {
      return item.id !== id;
    });
    setData(data);
  };
  /* use removeSelected to remove the selected data */
  const removeSelected = () => {
    const idArray = selectedData.map((e) => e.id);
    data = data.filter((item) => {
      return !idArray.includes(item.id);
    });
    setData(data);
    setSelectedData([]);
  };

  /* use Effect to get the data from the server */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let { data: dataList } = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
        dataList = dataList.map((item) => {
          var temp = Object.assign({}, item);
          temp.key = item.id;
          return temp;
        });
        setData(dataList);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.log(e);
      }
    };
    fetchData();
  }, []);
  /* isEditing to check if the data is being edited */
  const isEditing = (record) => record.key === editingKey;

  /* use edit to edit the data */

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

    /* use cancel to cancel the editing */

  const cancel = () => {
    setEditingKey("");
  };

/* use save to save the data */

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log(errInfo);
    }
  };

    /* use columns to store the columns of the table */

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "50%",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "50%",
      editable: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      width: "50%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      className: "operation",
      width: "50%",
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <>
            {editable ? (
              <span>
                <a
                  href="/#"
                  onClick={() => save(record.key)}
                  style={{
                    marginRight: 8,
                  }}
                >
                  Save
                </a>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a href="/#">Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <Typography.Link
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
              >
                <EditOutlined />
              </Typography.Link>
            )}
            <div className="delete-btn">
              <Typography.Link
                disabled={editingKey !== ""}
                onClick={() => removeId(record.id)}
              >
                <DeleteTwoTone twoToneColor="#00FF00" />
              </Typography.Link>
            </div>
          </>
        );
      },
    },
  ];
  /* use mergedColumns to merge the columns */
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  /* use rowSelection to store the row selection */
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedData(selectedRows);
    },
  };

  /* use handleSearch to search the data */

  const onSearchChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };
  return (
    <>
      <Search
        placeholder="Search by name"
        onChange={onSearchChange}
        enterButton
      />
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowSelection={{
            ...rowSelection,
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      {selectedData.length > 0 && (
        <Button
          type="primary"
          danger
          className="delete-selected-btn"
          onClick={() => removeSelected()}
        >
          Delete Selected
        </Button>
      )}
    </>
  );
};

export default Users;