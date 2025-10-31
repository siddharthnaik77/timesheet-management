"use client";

import React, {useEffect }from "react";
import { Modal, Form, Input, Button, Select, Tooltip } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

// typescript interface 
interface TaskModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  form: any;
  editingTask: any;
  hours: number;
  setHours: (h: number) => void;
}

export default function TaskModal({
  open,
  onCancel,
  onFinish,
  form,
  editingTask,
  hours,
  setHours,
}: TaskModalProps) {

  // add hour on change
  const decrease = () => {
    if (hours > 1) setHours(hours - 1);
  };

  // remove hour on change
  const increase = () => {
    if (hours < 8) setHours(hours + 1);
  };

  useEffect(() => {
    if (editingTask) {
      // setting edit task hour if not default 1 hour
      form.setFieldsValue(editingTask);
      setHours(editingTask.hours || 1); 
    } else {
      form.resetFields();
      setHours(1); 
    }
  }, [editingTask, form, setHours]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={646}
      className="[&_.ant-modal-content]:!bg-white [&_.ant-modal-content]:!rounded-lg [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-gray-200 [&_.ant-modal-body]:!p-6"
      title={
        <div className="flex items-center justify-between h-[60px] px-5 bg-white border-b border-gray-200 rounded-t-lg">
          <span className="text-lg font-semibold text-gray-800">
            {editingTask ? "Edit Task" : "Add New Entry"}
          </span>
        </div>
      }
    >
      {/* form end */}
      <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false} className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-4">
          {/* select project start */}
          <Form.Item name="project"
            label={
              <div className="flex items-center gap-2">
                <span>
                  Select Project <span className="text-red-500">*</span>
                </span>
                <Tooltip title="select project you are working on" placement="right">
                  <span className="flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-gray-900 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition">
                    i
                  </span>
                </Tooltip>
              </div>
            }
            rules={[{ required: true, message: "Please select a project" }]}
          >
            <Select placeholder="Select Project" className="!w-full md:!w-[364px] !h-[42px]">
              <Option value="Freightgain">Freightgain</Option>
              <Option value="MSTA">MSTA</Option>
              <Option value="Slickdine">Slickdine</Option>
            </Select>
          </Form.Item>
          {/* select project start */}

          {/* Type of Work start */}
          <Form.Item name="type"
            label={
              <div className="flex items-center gap-2">
                <span>
                  Select Type <span className="text-red-500">*</span>
                </span>
                <Tooltip title="select type of work" placement="right">
                  <span className="flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-gray-900 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition">
                    i
                  </span>
                </Tooltip>
              </div>
            }
            rules={[{ required: true, message: "Please select work type" }]}
          >
            <Select placeholder="Select type" className="!w-full md:!w-[364px] !h-[42px]">
              <Option value="Change Request">Change Request</Option>
              <Option value="New Development">New Development</Option>
              <Option value="Bug Fixing">Bug Fixing</Option>
            </Select>
          </Form.Item>
          {/* Type of Work start */}

          {/* Description */}
          <Form.Item name="description"
            label={
              <div className="flex items-center gap-2">
                <span>
                  Task Description <span className="text-red-500">*</span>
                </span>
              </div>
            }
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter task details" className="!w-full md:!w-[364px]" />
          </Form.Item>
          {/* Description */}

          {/* Hours */}
          <Form.Item
            name="hours"
            label={
              <div className="flex items-center gap-2">
                <span>
                  Hours <span className="text-red-500">*</span>
                </span>
              </div>
            }
          >
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-[110px] sm:w-[110px]">
              <Button type="text" icon={<MinusOutlined />} onClick={decrease} className="!w-[34px] !h-[37px] !border-r !border-gray-300 !rounded-none flex items-center justify-center text-gray-700 hover:text-red-500 hover:bg-gray-100" />

              <Input type="number" min={1} max={8} value={hours} readOnly className="!w-[47px] !h-[37px] !border-0 !text-center focus:!shadow-none focus:!border-0" />

              <Button type="text" icon={<PlusOutlined />} onClick={increase} className="!w-[34px] !h-[37px] !border-l !border-gray-300 !rounded-none flex items-center justify-center text-gray-700 hover:text-green-500 hover:bg-gray-100" />
            </div>
          </Form.Item>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between mt-6 border-t border-gray-200 pt-4 gap-3">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full sm:w-[295px] h-[37px] rounded-lg bg-[#1C64F2] text-white hover:bg-[#1552C9] text-sm font-medium"
          >
            {editingTask ? "Update Entry" : "Add Entry"}
          </Button>

          <Button
            onClick={onCancel}
            className="w-full sm:w-[295px] h-[34px] rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium"
          >
            Cancel
          </Button>
        </div>
        {/* Footer Buttons */}
      </Form>
      {/* form end */}
    </Modal>
  );
}
